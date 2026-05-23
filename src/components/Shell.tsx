import type { ReactNode } from "react";
import { MobileTopBar, Sidebar } from "./Sidebar";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="relative flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-bg/60 px-6 pt-10 pb-8 sm:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-clay">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-[32px] font-semibold leading-[1.05] tracking-tight text-ink sm:text-[40px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-muted">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex items-center gap-2.5">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
