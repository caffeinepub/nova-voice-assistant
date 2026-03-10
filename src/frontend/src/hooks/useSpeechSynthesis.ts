import { useCallback, useRef } from "react";

interface UseSpeechSynthesisOptions {
  onStart?: () => void;
  onEnd?: () => void;
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
          (v) =>
            v.name.toLowerCase().includes("female") ||
            v.name.includes("Samantha") ||
            v.name.includes("Google UK English Female") ||
            v.name.includes("Karen") ||
            v.name.includes("Victoria"),
        );
        if (preferred) utterance.voice = preferred;
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.addEventListener("voiceschanged", setVoice, {
          once: true,
        });
      }

      utterance.onstart = () => options.onStart?.();
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = () => options.onEnd?.();

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [options],
  );

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return { speak, cancel };
}
