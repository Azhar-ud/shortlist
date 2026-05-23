import clsx from "clsx";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const PAD: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  className,
  interactive = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-border bg-bg-card",
        "shadow-[var(--shadow-sm)]",
        interactive &&
          "transition-shadow duration-200 hover:shadow-[var(--shadow-md)]",
        PAD[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: CardHeaderProps) {
  return (
    <header
      className={clsx(
        "flex items-start justify-between gap-4 border-b border-dashed border-border-strong/70 pb-4 mb-4",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="font-display text-[17px] font-semibold leading-tight text-ink">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
