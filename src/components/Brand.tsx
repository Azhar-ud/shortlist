import Link from "next/link";

export function Brand() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
      <Link href="/" className="flex items-baseline gap-3">
        <span className="font-display text-2xl italic leading-none">Shortlist</span>
        <span className="hidden text-[11px] uppercase tracking-[0.22em] text-text-dim sm:inline">
          AI screening copilot
        </span>
      </Link>
      <nav className="flex items-center gap-5 text-xs">
        <Link href="/new" className="text-text-muted hover:text-accent">
          New screening
        </Link>
        <a
          href="https://github.com/Azhar-ud/shortlist"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-accent"
        >
          GitHub
        </a>
      </nav>
    </div>
  );
}
