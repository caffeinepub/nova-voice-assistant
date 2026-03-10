import type { AppStatus } from "../types/nova";

interface NovaOrbProps {
  status: AppStatus;
}

export function NovaOrb({ status }: NovaOrbProps) {
  const isListening = status === "listening";
  const isProcessing = status === "processing";
  const isSpeaking = status === "speaking";

  const orbGlowColor = isListening
    ? "oklch(0.82 0.2 195)"
    : isProcessing
      ? "oklch(0.78 0.16 70)"
      : isSpeaking
        ? "oklch(0.75 0.18 150)"
        : "oklch(0.65 0.14 195)";

  const ringColor = isListening
    ? "#00e5ff"
    : isProcessing
      ? "#ffaa00"
      : isSpeaking
        ? "#00ff88"
        : "#0099bb";

  const glowWithAlpha = orbGlowColor.replace(")", " / 0.5)");

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 180, height: 180 }}
    >
      {isListening && (
        <>
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 180,
              height: 180,
              border: `2px solid ${ringColor}`,
              animation: "orb-ring-expand 1.2s ease-out infinite",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 180,
              height: 180,
              border: `1px solid ${ringColor}`,
              animation: "orb-ring-expand-2 1.2s ease-out 0.4s infinite",
              opacity: 0.5,
            }}
          />
        </>
      )}

      {isProcessing && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 190,
            height: 190,
            border: `2px solid ${ringColor}`,
            borderTopColor: "transparent",
            animation: "orb-rotate 0.8s linear infinite",
          }}
        />
      )}

      {isSpeaking && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 180,
            height: 180,
            border: `2px solid ${ringColor}`,
            animation: "orb-ring-expand 2s ease-out infinite",
            opacity: 0.6,
          }}
        />
      )}

      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: 140,
          height: 140,
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.95 0.05 200), oklch(0.5 0.2 210) 40%, oklch(0.2 0.12 230) 70%, oklch(0.1 0.05 240))",
          boxShadow: `0 0 30px ${orbGlowColor}, 0 0 60px ${glowWithAlpha}, inset 0 0 30px oklch(0 0 0 / 0.4)`,
          animation: isListening
            ? "orb-ring-expand 0.8s ease-in-out infinite alternate"
            : isSpeaking
              ? "orb-wave 0.6s ease-in-out infinite"
              : "orb-idle-pulse 3s ease-in-out infinite",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 50,
            height: 50,
            top: 20,
            left: 25,
            background:
              "radial-gradient(circle, oklch(0.98 0.02 200 / 0.9), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, oklch(0.5 0.15 200 / 0.08) 10px, oklch(0.5 0.15 200 / 0.08) 20px)",
          }}
        />
      </div>

      <div
        className="absolute -bottom-8 font-display font-bold tracking-[0.3em] text-sm nova-glow-text"
        style={{ color: ringColor }}
      >
        NOVA
      </div>
    </div>
  );
}
