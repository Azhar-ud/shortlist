import clsx from "clsx";
import { ScoreRing } from "@/components/ui/ScoreRing";
import type { Candidate } from "@/lib/types";

interface CandidateRowProps {
  candidate: Candidate;
  rank: number;
}

const REC_STYLES: Record<string, string> = {
  Hire: "bg-up/20 text-up border-up/30",
  "Phone screen": "bg-accent-soft text-accent border-accent/30",
  Pass: "bg-down/15 text-down border-down/30",
};

function recStyle(rec: string | null): string {
  if (!rec) return "bg-bg-elevated text-text-dim border-border";
  for (const key of Object.keys(REC_STYLES)) {
    if (rec.startsWith(key)) return REC_STYLES[key];
  }
  return "bg-warn/15 text-warn border-warn/30";
}

export function CandidateRow({ candidate, rank }: CandidateRowProps) {
  const isAnalyzing =
    candidate.status === "queued" || candidate.status === "analyzing";

  return (
    <li className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-5 border-b border-border px-6 py-5 last:border-b-0">
      <span className="tabular w-8 font-mono text-sm text-text-dim">
        {String(rank).padStart(2, "0")}
      </span>
      <ScoreRing score={candidate.score} size={56} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h3 className="truncate font-display text-xl leading-tight text-text">
            {candidate.name ?? `Candidate ${candidate.position + 1}`}
          </h3>
          {isAnalyzing ? (
            <span className="rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
              {candidate.status === "analyzing" ? "Analyzing…" : "Queued"}
            </span>
          ) : candidate.status === "error" ? (
            <span className="rounded-full border border-down/30 bg-down/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-down">
              Error
            </span>
          ) : null}
        </div>
        {candidate.reasoning ? (
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-text-muted">
            {candidate.reasoning}
          </p>
        ) : candidate.error ? (
          <p className="mt-2 text-sm text-down">{candidate.error}</p>
        ) : isAnalyzing ? (
          <div className="mt-2 space-y-1.5">
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
          </div>
        ) : null}
        {(candidate.strengths?.length ?? 0) > 0 ||
        (candidate.gaps?.length ?? 0) > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TagBlock label="Strengths" items={candidate.strengths} tone="up" />
            <TagBlock label="Gaps" items={candidate.gaps} tone="down" />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          className={clsx(
            "whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider",
            recStyle(candidate.recommendation)
          )}
        >
          {candidate.recommendation ?? "pending"}
        </span>
      </div>
    </li>
  );
}

interface TagBlockProps {
  label: string;
  items: string[] | null;
  tone: "up" | "down";
}

function TagBlock({ label, items, tone }: TagBlockProps) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-text-dim">
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className={clsx(
              "flex items-start gap-2 text-[13px] leading-snug",
              tone === "up" ? "text-text" : "text-text-muted"
            )}
          >
            <span
              className={clsx(
                "mt-1.5 h-1 w-1 shrink-0 rounded-full",
                tone === "up" ? "bg-up" : "bg-down"
              )}
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
