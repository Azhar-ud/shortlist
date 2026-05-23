"use client";

import useSWR from "swr";
import { CandidateRow } from "@/components/CandidateRow";
import { Button } from "@/components/ui/Button";
import type { ApiResponse, ScreeningView } from "@/lib/types";
import { timeAgo } from "@/lib/format";

interface ResultsViewProps {
  id: string;
  initial: ScreeningView;
}

async function fetcher(url: string): Promise<ScreeningView> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as ApiResponse<ScreeningView>;
  if (!body.success || !body.data) throw new Error(body.error ?? "Empty");
  return body.data;
}

export function ResultsView({ id, initial }: ResultsViewProps) {
  const { data } = useSWR<ScreeningView>(`/api/screenings/${id}`, fetcher, {
    fallbackData: initial,
    refreshInterval: (latest) =>
      latest?.screening.status === "done" ||
      latest?.screening.status === "error"
        ? 0
        : 2000,
    revalidateOnFocus: false,
  });

  const view = data ?? initial;
  const ranked = [...view.candidates].sort((a, b) => {
    if (a.score == null && b.score == null) return a.position - b.position;
    if (a.score == null) return 1;
    if (b.score == null) return -1;
    return b.score - a.score;
  });

  const done = ranked.filter((c) => c.status === "done").length;
  const total = ranked.length;
  const isRunning =
    view.screening.status === "running" || view.screening.status === "pending";

  function exportCsv() {
    const rows = [
      ["rank", "name", "score", "recommendation", "strengths", "gaps"].join(","),
      ...ranked.map((c, i) =>
        [
          String(i + 1),
          quote(c.name ?? ""),
          c.score?.toString() ?? "",
          quote(c.recommendation ?? ""),
          quote((c.strengths ?? []).join(" · ")),
          quote((c.gaps ?? []).join(" · ")),
        ].join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shortlist-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-10">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent">
            {view.job.kind === "demo" ? "Sample screening" : "Screening"}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight">
            {view.job.title}
          </h1>
          <p className="mt-1 text-xs text-text-dim">
            Started {timeAgo(view.screening.createdAt)} · {done} of {total} analyzed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={exportCsv}
            disabled={done === 0}
          >
            Export CSV
          </Button>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
            Ranked candidates
          </span>
          {isRunning ? (
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-accent">
              <span className="pulse-dot" aria-hidden />
              Analyzing
            </span>
          ) : view.screening.status === "done" ? (
            <span className="font-mono text-[10px] uppercase tracking-wider text-up">
              Complete
            </span>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-down">
              Error
            </span>
          )}
        </div>
        <ol>
          {ranked.map((c, i) => (
            <CandidateRow key={c.id} candidate={c} rank={i + 1} />
          ))}
        </ol>
      </section>

      <details className="mt-6 rounded-2xl border border-border bg-bg-card">
        <summary className="cursor-pointer px-6 py-4 text-xs uppercase tracking-wider text-text-muted">
          Show job description
        </summary>
        <pre className="whitespace-pre-wrap border-t border-border px-6 py-4 font-sans text-sm leading-relaxed text-text-muted">
          {view.job.description}
        </pre>
      </details>
    </div>
  );
}

function quote(s: string): string {
  return `"${s.replace(/"/g, '""')}"`;
}
