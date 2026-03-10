import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function TimerWidget() {
  const [inputMins, setInputMins] = useState("5");
  const [inputSecs, setInputSecs] = useState("0");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && secondsLeft !== null && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s === null || s <= 1) {
            setRunning(false);
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("Nova Timer", {
                body: "Your countdown timer has finished!",
              });
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, secondsLeft]);

  const handleStart = () => {
    if (secondsLeft === null || secondsLeft === 0) {
      const total =
        (Number.parseInt(inputMins) || 0) * 60 +
        (Number.parseInt(inputSecs) || 0);
      if (total <= 0) return;
      setSecondsLeft(total);
      setInitialSeconds(total);
      setRunning(true);
    } else {
      setRunning((r) => !r);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(null);
    setInitialSeconds(0);
  };

  const displaySecs = secondsLeft !== null ? secondsLeft : 0;
  const mins = Math.floor(displaySecs / 60);
  const secs = displaySecs % 60;
  const progress =
    initialSeconds > 0 && secondsLeft !== null
      ? (1 - secondsLeft / initialSeconds) * 100
      : 0;
  const isDone = secondsLeft === 0 && initialSeconds > 0;

  return (
    <div className="flex flex-col gap-2">
      <h3
        className="text-xs font-mono font-bold tracking-widest px-1"
        style={{ color: "oklch(0.72 0.14 195)" }}
      >
        TIMER
      </h3>

      {secondsLeft === null ? (
        <div className="flex items-center gap-1.5">
          <input
            data-ocid="timer.input"
            type="number"
            min="0"
            max="99"
            value={inputMins}
            onChange={(e) => setInputMins(e.target.value)}
            className="nova-input w-full rounded-lg px-2 py-1.5 text-center text-sm font-mono"
            placeholder="mm"
          />
          <span
            className="text-sm font-mono"
            style={{ color: "oklch(0.55 0.06 220)" }}
          >
            :
          </span>
          <input
            type="number"
            min="0"
            max="59"
            value={inputSecs}
            onChange={(e) => setInputSecs(e.target.value)}
            className="nova-input w-full rounded-lg px-2 py-1.5 text-center text-sm font-mono"
            placeholder="ss"
          />
        </div>
      ) : (
        <div className="relative flex items-center justify-center py-2">
          <svg
            width="80"
            height="80"
            className="absolute"
            role="img"
            aria-label="Timer progress"
          >
            <title>Timer progress</title>
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="oklch(0.18 0.04 240)"
              strokeWidth="4"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={isDone ? "oklch(0.78 0.16 70)" : "oklch(0.78 0.17 195)"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
              transform="rotate(-90 40 40)"
              style={{
                transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
              }}
            />
          </svg>
          <div className="relative text-center">
            <span
              className="text-lg font-mono font-bold"
              style={{
                color: isDone ? "oklch(0.82 0.16 70)" : "oklch(0.88 0.12 195)",
                textShadow: isDone
                  ? "0 0 12px oklch(0.78 0.16 70 / 0.6)"
                  : "0 0 12px oklch(0.78 0.17 195 / 0.5)",
              }}
            >
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-1.5">
        <button
          type="button"
          data-ocid="timer.start_button"
          onClick={handleStart}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            background: running
              ? "oklch(0.62 0.22 27 / 0.2)"
              : "oklch(0.78 0.17 195 / 0.2)",
            color: running ? "oklch(0.75 0.2 27)" : "oklch(0.82 0.17 195)",
            border: running
              ? "1px solid oklch(0.62 0.22 27 / 0.4)"
              : "1px solid oklch(0.78 0.17 195 / 0.4)",
          }}
        >
          {running ? <Pause size={12} /> : <Play size={12} />}
          {running ? "Pause" : secondsLeft !== null ? "Resume" : "Start"}
        </button>
        {secondsLeft !== null && (
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105 active:scale-95"
            style={{
              background: "oklch(0.16 0.03 240)",
              color: "oklch(0.55 0.05 220)",
              border: "1px solid oklch(0.22 0.04 240)",
            }}
            aria-label="Reset timer"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
