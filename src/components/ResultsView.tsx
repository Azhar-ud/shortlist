"use client";

import useSWR from "swr";
import { motion } from "motion/react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CandidateCard } from "@/components/CandidateCard";
import { JobDescriptionPanel } from "@/components/JobDescriptionPanel";
import { BehindTheScreening } from "@/components/BehindTheScreening";
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
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  function exportCsv() {
    const rows = [
      ["rank", "name", "score", "recommendation", "strengths", "gaps"].join(
        ","
      ),
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

  async function copyShare() {
    try {
      const url = `${window.location.origin}/r/${id}`;
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div className="px-6 pb-20 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5">
        <div className="flex items-center gap-4">
          <Badge
            tone={
              view.screening.status === "done"
                ? "good"
                : view.screening.status === "error"
                  ? "bad"
                  : "clay"
            }
            dot
          >
            {view.screening.status}
          </Badge>
          <span className="font-mono text-[12px] text-ink-muted">
            <span className="text-ink">{done}</span>
            <span className="text-ink-dim">/</span>
            <span className="text-ink-dim">{total}</span> analyzed
          </span>
          <span className="text-[12px] text-ink-dim">
            started {timeAgo(view.screening.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={copyShare}>
            <Share2 className="h-3.5 w-3.5" aria-hidden />
            Copy link
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={exportCsv}
            disabled={done === 0}
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Export CSV
          </Button>
        </div>
      </div>

      {isRunning ? (
        <div className="mt-1 mb-6 h-[3px] w-full overflow-hidden rounded-full bg-bg-soft">
          <motion.div
            className="h-full bg-clay"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      ) : (
        <div className="mt-6" />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
            Ranked candidates
          </h2>
          <ul className="flex flex-col gap-3">
            {ranked.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <CandidateCard candidate={c} rank={i + 1} />
              </motion.li>
            ))}
          </ul>
        </section>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <JobDescriptionPanel
            title={view.job.title}
            description={view.job.description}
          />
          <BehindTheScreening />
        </aside>
      </div>
    </div>
  );
}

function quote(s: string): string {
  return `"${s.replace(/"/g, '""')}"`;
}
