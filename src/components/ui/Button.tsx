import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-ink text-bg hover:bg-clay-strong disabled:bg-ink-faint disabled:cursor-not-allowed border border-ink hover:border-clay-strong disabled:border-ink-faint shadow-[var(--shadow-sm)]",
  secondary:
    "bg-bg-card text-ink border border-border-strong hover:bg-bg-soft hover:border-ink shadow-[var(--shadow-sm)]",
  ghost:
    "text-ink-muted hover:text-ink hover:bg-bg-soft border border-transparent",
  danger:
    "bg-bad text-bg hover:bg-bad/90 border border-bad shadow-[var(--shadow-sm)]",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-[12px]",
  md: "h-10 px-4 text-[13px]",
  lg: "h-11 px-5 text-[14px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-clay/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        VARIANT[variant],
        SIZE[size],
        className
      )}
    >
      {children}
    </button>
  );
}
