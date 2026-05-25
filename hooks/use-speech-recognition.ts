"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSpeechRecognitionConstructor } from "@/lib/speech-recognition";

function collectTranscript(results: SpeechRecognitionResultList): string {
  let text = "";
  for (let i = 0; i < results.length; i++) {
    text += results[i][0].transcript;
  }
  return text.trim();
}

export function useSpeechRecognition(lang = "en-US") {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    setSupported(getSpeechRecognitionConstructor() !== undefined);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(
    (onResult: (text: string) => void) => {
      const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
      if (!SpeechRecognitionCtor) {
        setError("Speech recognition is not supported in this browser.");
        return;
      }

      recognitionRef.current?.abort();

      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
      onResultRef.current = onResult;

      setError(null);
      setInterimTranscript("");

      recognition.onstart = () => setListening(true);

      recognition.onresult = (event) => {
        const transcript = collectTranscript(event.results);
        const isFinal = event.results[event.results.length - 1]?.isFinal;
        if (isFinal) {
          setInterimTranscript("");
          if (transcript) onResultRef.current?.(transcript);
        } else {
          setInterimTranscript(transcript);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "aborted") return;
        const message =
          event.error === "not-allowed"
            ? "Microphone access was denied."
            : event.error === "no-speech"
              ? "No speech detected. Try again."
              : "Speech recognition failed. Try again.";
        setError(message);
      };

      recognition.onend = () => {
        setListening(false);
        setInterimTranscript("");
      };

      try {
        recognition.start();
      } catch {
        setError("Could not start speech recognition.");
        setListening(false);
      }
    },
    [lang]
  );

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  return {
    supported,
    listening,
    interimTranscript,
    error,
    start,
    stop,
  };
}
