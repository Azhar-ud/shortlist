import clsx from "clsx";

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Shortlist mark: a tight stack of three lines with the top one accented.
 * Reads as a literal "shortlist" — the first item is highlighted.
 */
export function Logo({ size = 22, className }: LogoProps) {
  const w = size;
  const h = size;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
      aria-hidden
    >
      <rect x="2" y="3" width="18" height="3" rx="1.4" fill="var(--clay)" />
      <rect
        x="2"
        y="9.5"
        width="13"
        height="3"
        rx="1.4"
        fill="var(--ink)"
        opacity="0.85"
      />
      <rect
        x="2"
        y="16"
        width="10"
        height="3"
        rx="1.4"
        fill="var(--ink)"
        opacity="0.4"
      />
    </svg>
  );
}
