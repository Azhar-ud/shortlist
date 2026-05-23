import clsx from "clsx";
import { scoreClass } from "@/lib/format";

interface ScoreRingProps {
  score: number | null;
  size?: number;
  className?: string;
}

export function ScoreRing({ score, size = 64, className }: ScoreRingProps) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const pct = score == null ? 0 : Math.max(0, Math.min(100, score));
  const offset = c * (1 - pct / 100);

  return (
    <div
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center",
        scoreClass(score),
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--score-color)"
          strokeWidth={3}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular font-mono text-base font-medium leading-none text-text">
          {score == null ? "—" : score}
        </span>
        <span className="mt-0.5 text-[8px] uppercase tracking-wider text-text-dim">
          fit
        </span>
      </span>
    </div>
  );
}
