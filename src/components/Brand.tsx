import Link from "next/link";
import { Logo } from "./Logo";

interface BrandProps {
  size?: "sm" | "md";
}

export function Brand({ size = "md" }: BrandProps) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
    >
      <Logo size={size === "sm" ? 18 : 22} />
      <span className="flex items-baseline gap-1.5">
        <span
          className={`font-display ${size === "sm" ? "text-[15px]" : "text-[17px]"} font-semibold tracking-tight text-ink`}
        >
          Shortlist
        </span>
        <span className="font-mono text-[10px] tracking-[0.16em] text-ink-faint">
          0.1
        </span>
      </span>
    </Link>
  );
}
