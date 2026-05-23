"use client";

import { useState } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, FileText, Quote, Sparkles } from "lucide-react";
import { ScoreDial, recommendationTone } from "./ScoreDial";
import { Badge } from "./ui/Badge";
import type { Candidate } from "@/lib/types";

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
}

export function CandidateCard({ candidate, rank }: CandidateCardProps) {
  const [open, setOpen] = useState(false);
  const analyzing =
    candidate.status === "queued" || candidate.status === "analyzing";
  const errored = candidate.status === "error";
  const tone = recommendationTone(candidate.recommendation);

  return (
    <article
      className={clsx(
        "group rounded-2xl border border-border bg-bg-card shadow-[var(--shadow-sm)] transition-all duration-200",
        open && "shadow-[var(--shadow-md)] border-border-strong"
      )}
    >
      <button
        type="button"
        onClick={() => !analyzing && setOpen((v) => !v)}
        className={clsx(
          "flex w-full items-center gap-5 p-5 text-left",
          analyzing ? "cursor-default" : "cursor-pointer"
        )}
        aria-expanded={open}
      >
        <span className="tabular w-7 shrink-0 font-mono text-[12px] text-ink-dim">
          {String(rank).padStart(2, "0")}
        </span>
        <ScoreDial score={candidate.score} size={68} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="truncate font-display text-[20px] font-semibold leading-tight text-ink">
              {candidate.name ?? `Candidate ${candidate.position + 1}`}
            </h3>
            {analyzing ? (
              <Badge tone="clay" dot>
                {candidate.status === "analyzing" ? "Analyzing" : "Queued"}
              </Badge>
            ) : errored ? (
              <Badge tone="bad" dot>
                Error
              </Badge>
            ) : candidate.recommendation ? (
              <Badge tone={tone} dot>
                {candidate.recommendation}
              </Badge>
            ) : null}
          </div>
          {candidate.reasoning ? (
            <p className="mt-1.5 line-clamp-2 max-w-prose text-[13.5px] leading-snug text-ink-muted">
              {candidate.reasoning}
            </p>
          ) : errored ? (
            <p className="mt-1.5 text-[13px] text-bad">{candidate.error}</p>
          ) : analyzing ? (
            <div className="mt-2 flex flex-col gap-1.5">
              <div className="skeleton h-3 w-[78%]" />
              <div className="skeleton h-3 w-[52%]" />
            </div>
          ) : null}
        </div>
        {!analyzing && !errored ? (
          <ChevronDown
            className={clsx(
              "h-4 w-4 shrink-0 text-ink-dim transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
        ) : null}
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 px-5 pb-5 pt-1 md:grid-cols-2">
              <ColumnList
                label="Strengths"
                tone="good"
                items={candidate.strengths}
              />
              <ColumnList
                label="Gaps"
                tone="bad"
                items={candidate.gaps}
              />
              {candidate.reasoning ? (
                <section className="md:col-span-2">
                  <SectionLabel icon={<Quote className="h-3 w-3" />}>
                    Reasoning
                  </SectionLabel>
                  <p className="rounded-[10px] border border-dashed border-border-strong/70 bg-bg-soft px-4 py-3 text-[14px] leading-relaxed text-ink">
                    {candidate.reasoning}
                  </p>
                </section>
              ) : null}
              <section className="md:col-span-2">
                <SectionLabel icon={<FileText className="h-3 w-3" />}>
                  Resume submitted
                </SectionLabel>
                <details className="rounded-[10px] border border-border bg-bg-soft">
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-ink-dim hover:text-ink">
                    {(candidate.rawText.split("\n")[0] ?? "Resume").slice(0, 80)}
                    <Sparkles
                      className="h-3 w-3 text-clay"
                      aria-hidden
                    />
                  </summary>
                  <pre className="border-t border-border bg-bg-card px-4 py-3 font-mono text-[12px] leading-relaxed text-ink-muted whitespace-pre-wrap">
                    {candidate.rawText}
                  </pre>
                </details>
              </section>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

interface ColumnListProps {
  label: string;
  tone: "good" | "bad";
  items: string[] | null;
}

function ColumnList({ label, tone, items }: ColumnListProps) {
  if (!items?.length) {
    return (
      <section>
        <SectionLabel>{label}</SectionLabel>
        <p className="text-[13px] text-ink-dim italic">None cited.</p>
      </section>
    );
  }
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-[13.5px] leading-snug text-ink"
          >
            <span
              aria-hidden
              className="mt-2 h-1 w-1 shrink-0 rounded-full"
              style={{
                background:
                  tone === "good"
                    ? "var(--signal-good)"
                    : "var(--signal-bad)",
              }}
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

interface SectionLabelProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function SectionLabel({ icon, children }: SectionLabelProps) {
  return (
    <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
      {icon}
      {children}
    </div>
  );
}
