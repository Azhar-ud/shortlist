"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  BarChart3,
  ExternalLink,
  FilePlus2,
  HelpCircle,
  LayoutGrid,
} from "lucide-react";
import { Brand } from "./Brand";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  match?: (path: string) => boolean;
}

const NAV: NavItem[] = [
  {
    href: "/",
    label: "Overview",
    icon: <LayoutGrid className="h-[15px] w-[15px]" aria-hidden />,
    match: (p) => p === "/",
  },
  {
    href: "/dashboard",
    label: "Screenings",
    icon: <BarChart3 className="h-[15px] w-[15px]" aria-hidden />,
    match: (p) => p === "/dashboard" || p.startsWith("/r/"),
  },
  {
    href: "/new",
    label: "New screening",
    icon: <FilePlus2 className="h-[15px] w-[15px]" aria-hidden />,
  },
  {
    href: "/how",
    label: "How it works",
    icon: <HelpCircle className="h-[15px] w-[15px]" aria-hidden />,
  },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-[244px] shrink-0 flex-col border-r border-border bg-bg-sidebar lg:flex">
      <div className="px-5 pt-6 pb-5">
        <Brand />
      </div>
      <nav className="flex flex-col gap-0.5 px-3">
        {NAV.map((item) => {
          const active = item.match ? item.match(path) : path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13px] transition-colors",
                active
                  ? "bg-ink/[0.05] text-ink font-medium"
                  : "text-ink-muted hover:bg-bg-soft hover:text-ink"
              )}
            >
              <span
                className={clsx(
                  active ? "text-clay" : "text-ink-dim"
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 pb-5 pt-4">
        <hr className="dashed-divider mb-4" />
        <div className="rounded-[10px] border border-border bg-bg-card p-3 shadow-[var(--shadow-sm)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-clay">
            Demo build
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-ink-muted">
            No auth, no PII. Sample data lives on a shareable URL.
          </p>
        </div>
        <a
          href="https://github.com/Azhar-ud/shortlist"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2 text-[12px] text-ink-dim transition-colors hover:text-clay"
        >
          <ExternalLink className="h-[13px] w-[13px]" aria-hidden />
          Source on GitHub
        </a>
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg-sidebar/95 px-4 backdrop-blur lg:hidden">
      <Brand size="sm" />
      <Link
        href="/new"
        className="font-mono text-[11px] uppercase tracking-wider text-clay"
      >
        New →
      </Link>
    </div>
  );
}
