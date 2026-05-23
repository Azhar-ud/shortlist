import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const STYLES: Record<Variant, string> = {
  primary:
    "bg-accent text-bg hover:bg-accent-dim disabled:bg-accent-dim disabled:cursor-not-allowed",
  secondary:
    "bg-bg-card text-text border border-border hover:bg-bg-card-hover hover:border-border-strong",
  ghost: "text-text-muted hover:text-accent",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
        STYLES[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
