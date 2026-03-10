import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { Message } from "../types/nova";

interface HistoryPanelProps {
  messages: Message[];
  collapsed: boolean;
  onToggle: () => void;
}

export function HistoryPanel({
  messages,
  collapsed,
  onToggle,
}: HistoryPanelProps) {
  const userMessages = messages.filter((m) => m.role === "user");

  return (
    <aside
      data-ocid="history.panel"
      className="flex flex-col transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 40 : 220,
        background: "oklch(var(--sidebar))",
        borderRight: "1px solid oklch(var(--border))",
        minHeight: 0,
        flexShrink: 0,
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid oklch(var(--border))" }}
      >
        {!collapsed && (
          <span
            className="text-xs font-mono font-bold tracking-widest"
            style={{ color: "oklch(0.62 0.12 195)" }}
          >
            HISTORY
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="p-1 rounded-md transition-colors hover:bg-secondary ml-auto"
          style={{ color: "oklch(0.62 0.12 195)" }}
          aria-label={collapsed ? "Expand history" : "Collapse history"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {!collapsed && (
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {userMessages.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8">
                <Clock size={20} style={{ color: "oklch(0.35 0.05 220)" }} />
                <p
                  className="text-xs text-center"
                  style={{ color: "oklch(0.4 0.04 220)" }}
                >
                  Commands will appear here
                </p>
              </div>
            )}
            {userMessages.map((msg, idx) => (
              <div
                key={msg.id}
                data-ocid={`history.item.${idx + 1}`}
                className="rounded-lg px-2.5 py-2 transition-all cursor-default"
                style={{
                  background: "oklch(0.12 0.022 240)",
                  border: "1px solid oklch(0.18 0.04 240)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "oklch(0.4 0.1 195 / 0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "oklch(0.18 0.04 240)";
                }}
              >
                <p
                  className="text-xs truncate"
                  style={{ color: "oklch(0.72 0.06 210)" }}
                >
                  {msg.text}
                </p>
                <p
                  className="text-xs mt-0.5 font-mono"
                  style={{ color: "oklch(0.4 0.04 220)" }}
                >
                  {msg.timestamp.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </aside>
  );
}
