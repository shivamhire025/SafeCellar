"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Circle,
  Eraser,
  Pencil,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { drawStroke } from "@/lib/incident-annotation";
import type { AnnotationStroke, AnnotationTool } from "@/types/database";
import { cn } from "@/lib/utils";

const TOOLS: { id: AnnotationTool; label: string; icon: typeof Pencil }[] = [
  { id: "pen", label: "Draw", icon: Pencil },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "text", label: "Text", icon: Type },
];

function fitImageToBounds(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  const scale = Math.min(
    1,
    maxWidth / naturalWidth,
    maxHeight / naturalHeight
  );
  return {
    width: Math.max(1, Math.round(naturalWidth * scale)),
    height: Math.max(1, Math.round(naturalHeight * scale)),
  };
}

interface IncidentPhotoAnnotatorProps {
  imageUrl: string;
  initialStrokes?: AnnotationStroke[];
  /** Max height for the annotation viewport (keeps tall screenshots fully visible). */
  maxDisplayHeight?: number;
  onSave: (result: {
    strokes: AnnotationStroke[];
    annotatedDataUrl: string;
  }) => void | Promise<void>;
  onCancel?: () => void;
  saving?: boolean;
}

export function IncidentPhotoAnnotator({
  imageUrl,
  initialStrokes = [],
  maxDisplayHeight = 480,
  onSave,
  onCancel,
  saving = false,
}: IncidentPhotoAnnotatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [strokes, setStrokes] = useState<AnnotationStroke[]>(initialStrokes);
  const [tool, setTool] = useState<AnnotationTool>("pen");
  const [color, setColor] = useState("#DC2626");
  const [lineWidth, setLineWidth] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<AnnotationStroke | null>(
    null
  );
  const [ready, setReady] = useState(false);

  const getPoint = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    for (const s of strokes) drawStroke(ctx, s);
    if (currentStroke) drawStroke(ctx, currentStroke);
  }, [strokes, currentStroke]);

  const setupCanvas = useCallback(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!img?.complete || !canvas || !container) return;

    const maxW = container.clientWidth || 400;
    const { width, height } = fitImageToBounds(
      img.naturalWidth,
      img.naturalHeight,
      maxW,
      maxDisplayHeight
    );
    canvas.width = width;
    canvas.height = height;
    setReady(true);
    redraw();
  }, [maxDisplayHeight, redraw]);

  useEffect(() => {
    setReady(false);
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setupCanvas();
    };
    img.src = imageUrl;
  }, [imageUrl, setupCanvas]);

  useEffect(() => {
    if (!ready) return;
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => setupCanvas());
    observer.observe(container);
    return () => observer.disconnect();
  }, [ready, setupCanvas]);

  useEffect(() => {
    if (ready) redraw();
  }, [ready, redraw]);

  const finishStroke = (stroke: AnnotationStroke) => {
    setStrokes((prev) => [...prev, stroke]);
    setCurrentStroke(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getPoint(e);
    if (tool === "text") {
      const text = window.prompt("Label text");
      if (text?.trim()) {
        finishStroke({
          tool: "text",
          color,
          lineWidth,
          points: [x, y],
          text: text.trim(),
        });
      }
      return;
    }
    setDrawing(true);
    setCurrentStroke({
      tool,
      color,
      lineWidth,
      points: [x, y, x, y],
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !currentStroke) return;
    const { x, y } = getPoint(e);
    if (tool === "pen") {
      setCurrentStroke({
        ...currentStroke,
        points: [...currentStroke.points, x, y],
      });
    } else {
      setCurrentStroke({
        ...currentStroke,
        points: [
          currentStroke.points[0],
          currentStroke.points[1],
          x,
          y,
        ],
      });
    }
  };

  const handleMouseUp = () => {
    if (!drawing || !currentStroke) return;
    setDrawing(false);
    if (currentStroke.points.length >= 4) {
      finishStroke(currentStroke);
    } else {
      setCurrentStroke(null);
    }
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    redraw();
    const annotatedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
    await onSave({ strokes, annotatedDataUrl });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {TOOLS.map((t) => (
          <Button
            key={t.id}
            type="button"
            size="sm"
            variant={tool === t.id ? undefined : "secondary"}
            onClick={() => setTool(t.id)}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </Button>
        ))}
        <div className="flex items-center gap-1 ml-2">
          {["#DC2626", "#D97706", "#1D4ED8", "#FFFFFF"].map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              className={cn(
                "h-6 w-6 rounded-full border-2",
                color === c ? "border-neutral-900" : "border-neutral-300"
              )}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setStrokes([])}
        >
          <Eraser className="h-4 w-4" />
          Clear
        </Button>
      </div>
      <div
        ref={containerRef}
        className="relative w-full rounded-lg border border-neutral-200 bg-neutral-900"
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-auto max-w-full cursor-crosshair touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      <p className="text-xs text-neutral-500">
        Draw on the photo to highlight hazards, injuries, or damage. Use Text to
        add labels.
      </p>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="button" onClick={handleSave} disabled={saving || !ready}>
          {saving ? "Saving…" : "Save annotations"}
        </Button>
      </div>
    </div>
  );
}
