import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import type { Message } from "../types/nova";

interface ChatFeedProps {
  messages: Message[];
  interimText?: string;
}

export function ChatFeed({ messages, interimText }: ChatFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/interim changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText]);

  return (
    <ScrollArea className="flex-1 w-full px-4">
      <div className="flex flex-col gap-3 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            style={{ animation: "float-up 0.3s ease-out" }}
          >
            {msg.role === "nova" && (
              <div
                className="w-6 h-6 rounded-full flex-shrink-0 mr-2 mt-1"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.82 0.2 195), oklch(0.4 0.15 220))",
                  boxShadow: "0 0 8px oklch(0.78 0.17 195 / 0.6)",
                }}
              />
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
              }`}
              style={{
                background:
                  msg.role === "user"
                    ? "oklch(0.22 0.06 240)"
                    : "oklch(0.13 0.025 240)",
                border:
                  msg.role === "user"
                    ? "1px solid oklch(0.35 0.08 240)"
                    : "1px solid oklch(0.2 0.06 195 / 0.4)",
                boxShadow:
                  msg.role === "nova"
                    ? "0 0 15px oklch(0.78 0.17 195 / 0.08)"
                    : undefined,
              }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    msg.role === "user"
                      ? "oklch(0.88 0.02 220)"
                      : "oklch(0.92 0.02 215)",
                }}
              >
                {msg.text}
              </p>
              <p
                className="text-xs mt-1 font-mono"
                style={{ color: "oklch(0.48 0.04 220)" }}
              >
                {msg.timestamp.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {interimText && (
          <div className="flex justify-end">
            <div
              className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-2.5"
              style={{
                background: "oklch(0.18 0.04 240)",
                border: "1px solid oklch(0.82 0.2 195 / 0.3)",
              }}
            >
              <p
                className="text-sm italic"
                style={{ color: "oklch(0.65 0.06 220)" }}
              >
                {interimText}...
              </p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
