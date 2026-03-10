import type { AppStatus } from "../types/nova";

interface StatusBadgeProps {
  status: AppStatus;
}

const STATUS_CONFIG: Record<
  AppStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  idle: {
    label: "IDLE",
    color: "oklch(0.65 0.12 195)",
    bg: "oklch(0.65 0.12 195 / 0.1)",
    dot: "oklch(0.65 0.12 195)",
  },
  listening: {
    label: "LISTENING",
    color: "oklch(0.85 0.2 195)",
    bg: "oklch(0.85 0.2 195 / 0.12)",
    dot: "oklch(0.85 0.2 195)",
  },
  processing: {
    label: "PROCESSING",
    color: "oklch(0.82 0.16 70)",
    bg: "oklch(0.82 0.16 70 / 0.12)",
    dot: "oklch(0.82 0.16 70)",
  },
  speaking: {
    label: "SPEAKING",
    color: "oklch(0.78 0.18 150)",
    bg: "oklch(0.78 0.18 150 / 0.12)",
    dot: "oklch(0.78 0.18 150)",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div
      data-ocid="status.panel"
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.color}`,
        boxShadow: `0 0 10px ${cfg.bg}, 0 0 20px ${cfg.bg}`,
      }}
    >
      <span
        className="rounded-full"
        style={{
          width: 6,
          height: 6,
          background: cfg.dot,
          boxShadow: `0 0 6px ${cfg.dot}`,
          animation:
            status !== "idle"
              ? "orb-idle-pulse 1s ease-in-out infinite"
              : undefined,
        }}
      />
      {cfg.label}
    </div>
  );
}
