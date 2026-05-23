import clsx from "clsx";
import type { ReactNode } from "react";

type Tone = "neutral" | "clay" | "good" | "warn" | "bad" | "ink";

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

const TONE: Record<Tone, string> = {
  neutral: "bg-bg-soft text-ink-muted border-border",
  clay: "bg-clay-soft text-clay-strong border-clay/30",
  good: "bg-good-soft text-good border-good/30",
  warn: "bg-warn-soft text-warn border-warn/40",
  bad: "bg-bad-soft text-bad border-bad/30",
  ink: "bg-ink text-bg border-ink",
};

const DOT_COLOR: Record<Tone, string> = {
  neutral: "var(--ink-dim)",
  clay: "var(--clay)",
  good: "var(--signal-good)",
  warn: "var(--signal-warn)",
  bad: "var(--signal-bad)",
  ink: "white",
};

export function Badge({ tone = "neutral", children, dot, className }: BadgeProps) {
  return (
    <span
      className={clsx("chip border", TONE[tone], className)}
    >
      {dot ? (
        <span
          className="status-dot"
          style={{ ["--color" as string]: DOT_COLOR[tone] }}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  );
}
