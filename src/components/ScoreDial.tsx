import clsx from "clsx";

interface ScoreDialProps {
  score: number | null;
  size?: number;
  label?: string;
  className?: string;
}

/**
 * Arc-style score gauge. Sweeps -135° to +135° (270° total).
 * Color shifts continuously: red ≤40, amber ≤70, green ≤100.
 */
export function ScoreDial({
  score,
  size = 96,
  label = "FIT",
  className,
}: ScoreDialProps) {
  const pct = score == null ? 0 : Math.max(0, Math.min(100, score));
  const r = (size - 12) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // 270° arc from 135° (bottom-left) sweeping clockwise to 45° (bottom-right)
  const start = polar(cx, cy, r, 135);
  const end = polar(cx, cy, r, 135 + 270);
  const valEnd = polar(cx, cy, r, 135 + 270 * (pct / 100));

  const bgPath = arc(start, end, r, true);
  const valPath = arc(start, valEnd, r, pct > 50);

  const color = scoreColor(score);

  return (
    <div
      className={clsx("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        <path
          d={bgPath}
          fill="none"
          stroke="var(--border)"
          strokeWidth={6}
          strokeLinecap="round"
        />
        {score != null ? (
          <path
            d={valPath}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            style={{
              transition:
                "stroke 400ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        ) : null}
        {/* tick marks at 25 / 50 / 75 */}
        {[25, 50, 75].map((t) => {
          const p = polar(cx, cy, r - 9, 135 + 270 * (t / 100));
          const p2 = polar(cx, cy, r - 3, 135 + 270 * (t / 100));
          return (
            <line
              key={t}
              x1={p.x}
              y1={p.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--ink-faint)"
              strokeWidth={1}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="tabular font-mono text-[26px] font-semibold leading-none"
          style={{ color: score == null ? "var(--ink-faint)" : "var(--ink)" }}
        >
          {score == null ? "—" : Math.round(score)}
        </span>
        <span
          className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em]"
          style={{ color: score == null ? "var(--ink-faint)" : "var(--ink-dim)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(
  a: { x: number; y: number },
  b: { x: number; y: number },
  r: number,
  largeArc: boolean
): string {
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${largeArc ? 1 : 0} 1 ${b.x} ${b.y}`;
}

export function scoreColor(score: number | null | undefined): string {
  if (score == null) return "var(--ink-faint)";
  if (score >= 75) return "var(--signal-good)";
  if (score >= 55) return "var(--signal-warn)";
  if (score >= 35) return "var(--clay)";
  return "var(--signal-bad)";
}

export function recommendationTone(
  rec: string | null | undefined
): "good" | "clay" | "bad" | "warn" | "neutral" {
  if (!rec) return "neutral";
  if (rec.startsWith("Hire")) return "good";
  if (rec.startsWith("Phone")) return "clay";
  if (rec.startsWith("Pass")) return "bad";
  if (rec.startsWith("Borderline")) return "warn";
  return "neutral";
}
