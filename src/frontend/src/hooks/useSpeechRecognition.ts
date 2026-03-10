import { useCallback, useRef, useState } from "react";

interface UseSpeechRecognitionOptions {
  onResult: (text: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions) {
  const [interimText, setInterimText] = useState("");
  const [isSupported] = useState(() => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  const startListening = useCallback(() => {
    if (!isSupported || isListeningRef.current) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      isListeningRef.current = true;
      options.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
      if (final) {
        setInterimText("");
        options.onResult(final.trim());
      }
    };

    recognition.onerror = (event: any) => {
      isListeningRef.current = false;
      setInterimText("");
      options.onError?.(event.error);
      options.onEnd?.();
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setInterimText("");
      options.onEnd?.();
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, options]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return { startListening, stopListening, interimText, isSupported };
}
