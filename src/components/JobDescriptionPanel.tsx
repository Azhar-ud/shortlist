"use client";

import { useState } from "react";
import { ChevronDown, Briefcase } from "lucide-react";
import { Card } from "./ui/Card";

interface JobDescriptionPanelProps {
  title: string;
  description: string;
}

export function JobDescriptionPanel({
  title,
  description,
}: JobDescriptionPanelProps) {
  const [open, setOpen] = useState(false);
  const preview = description.split("\n").slice(0, 3).join("\n");

  return (
    <Card padding="none">
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
          <Briefcase className="h-3 w-3" aria-hidden />
          Job description
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-muted hover:text-clay"
        >
          {open ? "Collapse" : "Expand"}
          <ChevronDown
            className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </header>
      <div className="px-5 py-4">
        <h2 className="font-display text-[20px] font-semibold leading-tight text-ink">
          {title}
        </h2>
        <pre className="mt-3 max-h-[420px] overflow-y-auto whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-ink-muted">
          {open ? description : preview + (description.length > preview.length ? "…" : "")}
        </pre>
      </div>
    </Card>
  );
}
