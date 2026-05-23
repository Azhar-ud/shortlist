import Link from "next/link";
import { ChevronRight, Inbox } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { ScoreDial, recommendationTone } from "./ScoreDial";
import { timeAgo } from "@/lib/format";
import type { CandidateStatus, ScreeningStatus } from "@/lib/types";

export interface ScreeningRow {
  id: string;
  status: ScreeningStatus;
  candidateCount: number;
  completedCount: number;
  createdAt: string;
  jobTitle: string;
  jobKind: "demo" | "user";
  top: {
    name: string | null;
    score: number | null;
    recommendation: string | null;
    status: CandidateStatus;
  } | null;
}

interface RecentScreeningsProps {
  rows: ScreeningRow[];
}

export function RecentScreenings({ rows }: RecentScreeningsProps) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <Card padding="none" className="overflow-hidden">
      <ol className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.id}>
            <Link
              href={`/r/${row.id}`}
              className="group grid grid-cols-[auto_1fr_auto_auto] items-center gap-5 px-5 py-4 transition-colors hover:bg-bg-soft"
            >
              <ScoreDial score={row.top?.score ?? null} size={56} />

              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="truncate font-display text-[16px] font-semibold text-ink">
                    {row.jobTitle}
                  </h3>
                  {row.jobKind === "demo" ? (
                    <Badge tone="clay">Sample</Badge>
                  ) : null}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12.5px] text-ink-muted">
                  <span>
                    <span className="font-mono text-ink">
                      {row.completedCount}
                    </span>
                    <span className="text-ink-dim">/</span>
                    <span className="font-mono text-ink-dim">
                      {row.candidateCount}
                    </span>{" "}
                    analyzed
                  </span>
                  <Dot />
                  <span className="text-ink-dim">{timeAgo(row.createdAt)}</span>
                  {row.top?.name ? (
                    <>
                      <Dot />
                      <span className="text-ink-dim">
                        top:{" "}
                        <span className="text-ink">{row.top.name}</span>
                      </span>
                    </>
                  ) : null}
                </p>
              </div>

              <div className="hidden md:block">
                {row.top?.recommendation ? (
                  <Badge tone={recommendationTone(row.top.recommendation)}>
                    {row.top.recommendation}
                  </Badge>
                ) : null}
              </div>

              <StatusBadge status={row.status} />

              <ChevronRight
                className="hidden text-ink-dim transition-transform group-hover:translate-x-0.5 group-hover:text-clay md:block"
                size={16}
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function StatusBadge({ status }: { status: ScreeningStatus }) {
  switch (status) {
    case "running":
    case "pending":
      return (
        <Badge tone="clay" dot>
          Running
        </Badge>
      );
    case "done":
      return (
        <Badge tone="good" dot>
          Done
        </Badge>
      );
    case "error":
      return (
        <Badge tone="bad" dot>
          Error
        </Badge>
      );
  }
}

function Dot() {
  return <span aria-hidden className="text-ink-faint">·</span>;
}

function EmptyState() {
  return (
    <Card className="dotted-bg flex flex-col items-center gap-3 py-16 text-center" padding="lg">
      <span className="grid h-12 w-12 place-items-center rounded-full border border-dashed border-border-strong bg-bg-card">
        <Inbox className="h-5 w-5 text-ink-dim" aria-hidden />
      </span>
      <h3 className="font-display text-[18px] font-semibold text-ink">
        No screenings yet
      </h3>
      <p className="max-w-sm text-[13.5px] leading-relaxed text-ink-muted">
        Run a sample screening to see how Shortlist ranks resumes against a
        live job description.
      </p>
    </Card>
  );
}
