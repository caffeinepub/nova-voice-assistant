import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mic, MicOff } from "lucide-react";
import type { AppStatus } from "../types/nova";

interface MicButtonProps {
  status: AppStatus;
  onToggle: () => void;
  disabled?: boolean;
}

export function MicButton({ status, onToggle, disabled }: MicButtonProps) {
  const isListening = status === "listening";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-ocid="mic.toggle"
            onClick={onToggle}
            disabled={
              disabled || status === "processing" || status === "speaking"
            }
            className="relative rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2"
            style={{
              width: 72,
              height: 72,
              background: isListening
                ? "radial-gradient(circle, oklch(0.55 0.22 27), oklch(0.35 0.18 27))"
                : "radial-gradient(circle, oklch(0.22 0.08 240), oklch(0.14 0.04 240))",
              border: isListening
                ? "2px solid oklch(0.65 0.22 27)"
                : "2px solid oklch(0.78 0.17 195 / 0.5)",
              boxShadow: isListening
                ? "0 0 20px oklch(0.65 0.22 27 / 0.6), 0 0 40px oklch(0.65 0.22 27 / 0.3), inset 0 0 15px oklch(0.65 0.22 27 / 0.2)"
                : "0 0 15px oklch(0.78 0.17 195 / 0.2), 0 0 30px oklch(0.78 0.17 195 / 0.1)",
              animation: isListening
                ? "mic-pulse 1.2s ease-in-out infinite"
                : undefined,
            }}
            aria-label={
              isListening ? "Stop listening" : "Start listening (Space)"
            }
          >
            {isListening ? (
              <MicOff size={28} color="oklch(0.95 0.02 0)" />
            ) : (
              <Mic size={28} color="oklch(0.78 0.17 195)" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="font-mono text-xs"
          style={{
            background: "oklch(0.12 0.025 240)",
            border: "1px solid oklch(0.25 0.06 240)",
            color: "oklch(0.82 0.17 195)",
          }}
        >
          {isListening
            ? "Click or press Space to stop"
            : "Click or press Space to speak"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
