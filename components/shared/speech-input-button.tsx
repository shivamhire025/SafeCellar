"use client";

import { useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface SpeechInputButtonProps {
  onTranscript: (text: string) => void;
  ariaLabel: string;
  className?: string;
}

export function SpeechInputButton({
  onTranscript,
  ariaLabel,
  className,
}: SpeechInputButtonProps) {
  const { supported, listening, interimTranscript, error, start, stop } =
    useSpeechRecognition();

  useEffect(() => {
    if (!error) return;
    toast({
      title: "Voice input",
      description: error,
      variant: "destructive",
    });
  }, [error]);

  function handleClick() {
    if (!supported) {
      toast({
        title: "Voice input unavailable",
        description:
          "Use Chrome, Edge, or Safari on desktop or mobile. Firefox does not support browser speech recognition.",
        variant: "destructive",
      });
      return;
    }
    if (listening) {
      stop();
      return;
    }
    start(onTranscript);
  }

  return (
    <div className={cn("inline-flex flex-col items-end gap-1", className)}>
      <Button
        type="button"
        variant={listening ? "default" : "secondary"}
        size="icon"
        className={cn(
          "shrink-0",
          listening && "animate-pulse ring-2 ring-brand-400"
        )}
        onClick={handleClick}
        aria-label={listening ? `Stop ${ariaLabel}` : ariaLabel}
        aria-pressed={listening}
        title={listening ? "Stop listening" : ariaLabel}
      >
        {listening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      {listening && interimTranscript && (
        <p className="text-xs text-neutral-500 max-w-[12rem] text-right truncate">
          {interimTranscript}
        </p>
      )}
    </div>
  );
}
