import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertTriangle, Send } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ChatFeed } from "./components/ChatFeed";
import { HistoryPanel } from "./components/HistoryPanel";
import { MicButton } from "./components/MicButton";
import { NotesPanel } from "./components/NotesPanel";
import { NovaOrb } from "./components/NovaOrb";
import { QuickActions } from "./components/QuickActions";
import { RemindersPanel } from "./components/RemindersPanel";
import { StatusBadge } from "./components/StatusBadge";
import { TimerWidget } from "./components/TimerWidget";
import { useNovaCommands } from "./hooks/useNovaCommands";
import { useCreateNote, useCreateReminder } from "./hooks/useQueries";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "./hooks/useSpeechSynthesis";
import type { AppStatus, Message } from "./types/nova";

const queryClient = new QueryClient();

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function NovaApp() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [historyCollapsed, setHistoryCollapsed] = useState(false);
  const createNote = useCreateNote();
  const createReminder = useCreateReminder();
  const { processCommand } = useNovaCommands();
  const inputRef = useRef<HTMLInputElement>(null);
  const isHandlingRef = useRef(false);
  const welcomeRef = useRef(false);

  const addMessage = useCallback((role: "user" | "nova", text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: generateId(), role, text, timestamp: new Date() },
    ]);
  }, []);

  const { speak, cancel } = useSpeechSynthesis({
    onStart: () => setStatus("speaking"),
    onEnd: () => setStatus("idle"),
  });

  const handleCommand = useCallback(
    (input: string) => {
      if (!input.trim() || isHandlingRef.current) return;
      isHandlingRef.current = true;
      addMessage("user", input);
      setStatus("processing");

      setTimeout(() => {
        const result = processCommand(
          input,
          async (title, content) => {
            try {
              await createNote.mutateAsync({ title, content });
            } catch {
              toast.error("Failed to save note");
            }
          },
          async (text, scheduledTime) => {
            try {
              await createReminder.mutateAsync({ text, scheduledTime });
            } catch {
              toast.error("Failed to set reminder");
            }
          },
        );

        addMessage("nova", result.response);
        if (result.action) result.action();
        speak(result.response);
        isHandlingRef.current = false;
      }, 300);
    },
    [addMessage, processCommand, speak, createNote, createReminder],
  );

  const { startListening, stopListening, interimText, isSupported } =
    useSpeechRecognition({
      onResult: (text) => {
        handleCommand(text);
      },
      onStart: () => setStatus("listening"),
      onEnd: () => {
        setStatus((prev) => (prev === "listening" ? "idle" : prev));
      },
      onError: (error) => {
        setStatus("idle");
        if (error === "not-allowed") {
          toast.error(
            "Microphone access denied. Please allow microphone access and try again.",
          );
        }
      },
    });

  const handleMicToggle = useCallback(() => {
    if (status === "listening") {
      stopListening();
      setStatus("idle");
    } else if (status === "idle") {
      cancel();
      startListening();
    }
  }, [status, startListening, stopListening, cancel]);

  const handleSendText = useCallback(() => {
    if (!textInput.trim()) return;
    handleCommand(textInput);
    setTextInput("");
  }, [textInput, handleCommand]);

  // Welcome message - run once on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once
  useEffect(() => {
    if (welcomeRef.current) return;
    welcomeRef.current = true;
    const welcomeText =
      "Hello! Nova online and ready to assist you. How can I help today?";
    addMessage("nova", welcomeText);
    const t = setTimeout(() => speak(welcomeText), 1000);
    return () => clearTimeout(t);
  }, []);

  // Space bar shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement === document.body) {
        e.preventDefault();
        handleMicToggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleMicToggle]);

  return (
    <div
      className="flex h-full w-full overflow-hidden"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-60" />

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: "10%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, oklch(0.78 0.17 195 / 0.04) 0%, transparent 70%)",
        }}
      />

      {/* LEFT SIDEBAR */}
      <HistoryPanel
        messages={messages}
        collapsed={historyCollapsed}
        onToggle={() => setHistoryCollapsed((v) => !v)}
      />

      {/* CENTER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid oklch(var(--border))" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.85 0.2 195), oklch(0.45 0.18 220))",
                boxShadow: "0 0 12px oklch(0.78 0.17 195 / 0.5)",
              }}
            />
            <span
              className="font-display font-bold text-lg tracking-[0.2em] nova-glow-text"
              style={{ color: "oklch(0.88 0.15 195)" }}
            >
              NOVA
            </span>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.78 0.17 195 / 0.1)",
                color: "oklch(0.65 0.12 195)",
                border: "1px solid oklch(0.78 0.17 195 / 0.25)",
              }}
            >
              v2.1
            </span>
          </div>
          <StatusBadge status={status} />
        </header>

        {!isSupported && (
          <div
            className="flex items-center gap-2 px-4 py-2 text-xs flex-shrink-0"
            style={{
              background: "oklch(0.62 0.22 27 / 0.1)",
              borderBottom: "1px solid oklch(0.62 0.22 27 / 0.3)",
              color: "oklch(0.82 0.14 60)",
            }}
          >
            <AlertTriangle size={14} />
            Web Speech API not supported in this browser. Using text input mode
            only.
          </div>
        )}

        <div className="flex flex-col items-center gap-4 pt-6 pb-4 flex-shrink-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <NovaOrb status={status} />
          </motion.div>
        </div>

        <ChatFeed messages={messages} interimText={interimText} />

        <div className="px-4 pb-3 flex-shrink-0">
          <QuickActions onCommand={handleCommand} />
        </div>

        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid oklch(var(--border))" }}
        >
          <MicButton status={status} onToggle={handleMicToggle} />
          <input
            ref={inputRef}
            data-ocid="chat.input"
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText()}
            placeholder="Type a command or ask Nova anything..."
            className="nova-input flex-1 rounded-2xl px-4 py-3 text-sm"
          />
          <button
            type="button"
            data-ocid="chat.submit_button"
            onClick={handleSendText}
            disabled={!textInput.trim()}
            className="flex items-center justify-center rounded-2xl p-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "oklch(0.78 0.17 195 / 0.2)",
              border: "1px solid oklch(0.78 0.17 195 / 0.5)",
              color: "oklch(0.82 0.17 195)",
              boxShadow: "0 0 12px oklch(0.78 0.17 195 / 0.15)",
            }}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside
        className="flex flex-col gap-0 flex-shrink-0"
        style={{
          width: 260,
          background: "oklch(var(--sidebar))",
          borderLeft: "1px solid oklch(var(--border))",
        }}
      >
        <div
          className="flex-1 flex flex-col p-3 overflow-hidden"
          style={{
            borderBottom: "1px solid oklch(var(--border))",
            minHeight: 0,
          }}
        >
          <NotesPanel />
        </div>
        <div
          className="flex-1 flex flex-col p-3 overflow-hidden"
          style={{
            borderBottom: "1px solid oklch(var(--border))",
            minHeight: 0,
          }}
        >
          <RemindersPanel />
        </div>
        <div className="p-3 flex-shrink-0">
          <TimerWidget />
        </div>
      </aside>

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.12 0.025 240)",
            border: "1px solid oklch(0.25 0.06 240)",
            color: "oklch(0.88 0.08 210)",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NovaApp />
    </QueryClientProvider>
  );
}
