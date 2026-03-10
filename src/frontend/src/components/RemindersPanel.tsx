import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCreateReminder,
  useDeleteReminder,
  useGetReminders,
  useMarkReminderTriggered,
} from "../hooks/useQueries";

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, targetMs - Date.now()),
  );
  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining(Math.max(0, targetMs - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs, remaining]);
  return remaining;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "Now!";
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  if (hours > 0) return `${hours}h ${mins % 60}m`;
  if (mins > 0) return `${mins}m ${secs % 60}s`;
  return `${secs}s`;
}

export function RemindersPanel() {
  const { data: reminders = [], isLoading } = useGetReminders();
  const createReminder = useCreateReminder();
  const deleteReminder = useDeleteReminder();
  const markTriggered = useMarkReminderTriggered();
  const [text, setText] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const r of reminders) {
        if (!r.isTriggered) {
          const rTime = Number(r.scheduledTime / 1_000_000n);
          if (rTime <= now) {
            markTriggered.mutate(r.id);
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("Nova Reminder", {
                body: r.text,
                icon: "/assets/generated/nova-orb-bg-transparent.dim_400x400.png",
              });
            }
          }
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [reminders, markTriggered]);

  const handleAdd = async () => {
    if (!text.trim() || !dateTime) return;
    await createReminder.mutateAsync({
      text: text.trim(),
      scheduledTime: new Date(dateTime),
    });
    setText("");
    setDateTime("");
    setIsAdding(false);
  };

  const requestNotifPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const activeReminders = reminders.filter((r) => !r.isTriggered);
  const now = new Date();
  const minDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between px-1">
        <h3
          className="text-xs font-mono font-bold tracking-widest"
          style={{ color: "oklch(0.72 0.14 195)" }}
        >
          REMINDERS
        </h3>
        <button
          type="button"
          data-ocid="reminder.add_button"
          onClick={() => {
            setIsAdding((v) => !v);
            requestNotifPermission();
          }}
          className="p-1 rounded-md transition-colors hover:bg-secondary"
          style={{ color: "oklch(0.72 0.14 195)" }}
          aria-label="Add reminder"
        >
          <Plus size={14} />
        </button>
      </div>

      {isAdding && (
        <div
          className="rounded-xl p-3 flex flex-col gap-2"
          style={{
            background: "oklch(0.13 0.025 240)",
            border: "1px solid oklch(0.22 0.06 195 / 0.4)",
          }}
        >
          <input
            data-ocid="reminder.input"
            type="text"
            placeholder="What to remind you..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="nova-input w-full rounded-lg px-3 py-1.5 text-xs"
          />
          <input
            type="datetime-local"
            value={dateTime}
            min={minDateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="nova-input w-full rounded-lg px-3 py-1.5 text-xs"
          />
          <div className="flex gap-2">
            <button
              type="button"
              data-ocid="reminder.save_button"
              onClick={handleAdd}
              disabled={createReminder.isPending}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{
                background: "oklch(0.78 0.17 195 / 0.2)",
                color: "oklch(0.82 0.17 195)",
                border: "1px solid oklch(0.78 0.17 195 / 0.4)",
              }}
            >
              {createReminder.isPending ? "Setting..." : "Set Reminder"}
            </button>
            <button
              type="button"
              data-ocid="reminder.cancel_button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{
                background: "oklch(0.16 0.03 240)",
                color: "oklch(0.55 0.05 220)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1.5">
          {isLoading && (
            <div
              data-ocid="reminder.loading_state"
              className="text-xs text-center py-4"
              style={{ color: "oklch(0.48 0.04 220)" }}
            >
              Loading...
            </div>
          )}
          {!isLoading && activeReminders.length === 0 && (
            <div
              data-ocid="reminder.empty_state"
              className="flex flex-col items-center gap-2 py-4"
            >
              <Bell size={20} style={{ color: "oklch(0.35 0.05 220)" }} />
              <p className="text-xs" style={{ color: "oklch(0.45 0.04 220)" }}>
                No active reminders
              </p>
            </div>
          )}
          {activeReminders.map((reminder, idx) => {
            const targetMs = Number(reminder.scheduledTime / 1_000_000n);
            return (
              <ReminderItem
                key={reminder.id}
                text={reminder.text}
                targetMs={targetMs}
                ocidIndex={idx + 1}
                onDelete={() => deleteReminder.mutate(reminder.id)}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function ReminderItem({
  text,
  targetMs,
  ocidIndex,
  onDelete,
}: {
  text: string;
  targetMs: number;
  ocidIndex: number;
  onDelete: () => void;
}) {
  const remaining = useCountdown(targetMs);
  const isUrgent = remaining < 60000 && remaining > 0;
  const isDue = remaining === 0;

  return (
    <div
      data-ocid={`reminder.item.${ocidIndex}`}
      className="rounded-xl p-3 group flex items-start gap-2 transition-all"
      style={{
        background: isDue
          ? "oklch(0.15 0.04 70 / 0.3)"
          : "oklch(0.12 0.022 240)",
        border: isDue
          ? "1px solid oklch(0.78 0.16 70 / 0.5)"
          : isUrgent
            ? "1px solid oklch(0.78 0.16 70 / 0.3)"
            : "1px solid oklch(0.18 0.04 240)",
      }}
    >
      <Bell
        size={12}
        className="mt-0.5 flex-shrink-0"
        style={{
          color: isDue
            ? "oklch(0.82 0.16 70)"
            : isUrgent
              ? "oklch(0.75 0.16 70)"
              : "oklch(0.55 0.1 195)",
        }}
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-xs truncate"
          style={{ color: "oklch(0.82 0.04 210)" }}
        >
          {text}
        </p>
        <p
          className="text-xs font-mono mt-0.5"
          style={{
            color: isDue
              ? "oklch(0.85 0.16 70)"
              : isUrgent
                ? "oklch(0.78 0.14 70)"
                : "oklch(0.52 0.08 195)",
          }}
        >
          {formatCountdown(remaining)}
        </p>
      </div>
      <button
        type="button"
        data-ocid={`reminder.delete_button.${ocidIndex}`}
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all"
        style={{ color: "oklch(0.62 0.22 27)" }}
        aria-label="Delete reminder"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
