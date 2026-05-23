import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Shell, PageHeader } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SampleButton } from "@/components/SampleButton";
import {
  RecentScreenings,
  type ScreeningRow,
} from "@/components/RecentScreenings";
import { getServerSupabase } from "@/lib/supabase/server";
import type { CandidateStatus, ScreeningStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

interface ScreeningWithJob {
  id: string;
  status: ScreeningStatus;
  resume_count: number;
  created_at: string;
  jobs: { title: string; kind: "demo" | "user" } | null;
}

interface CandidateLite {
  screening_id: string;
  name: string | null;
  score: number | null;
  recommendation: string | null;
  status: CandidateStatus;
  position: number;
}

async function loadRows(): Promise<ScreeningRow[]> {
  const supabase = getServerSupabase();
  const { data: rawScreenings } = await supabase
    .from("screenings")
    .select(
      "id, status, resume_count, created_at, jobs ( title, kind )"
    )
    .order("created_at", { ascending: false })
    .limit(20);

  const screenings = ((rawScreenings ?? []) as unknown as ScreeningWithJob[]).filter(
    (s) => s.jobs != null
  );
  if (screenings.length === 0) return [];

  const ids = screenings.map((s) => s.id);
  const { data: rawCands } = await supabase
    .from("candidates")
    .select("screening_id, name, score, recommendation, status, position")
    .in("screening_id", ids);

  const cands = (rawCands ?? []) as CandidateLite[];
  const byScreening = new Map<string, CandidateLite[]>();
  for (const c of cands) {
    const arr = byScreening.get(c.screening_id) ?? [];
    arr.push(c);
    byScreening.set(c.screening_id, arr);
  }

  return screenings.map((s) => {
    const cs = byScreening.get(s.id) ?? [];
    const done = cs.filter((c) => c.status === "done");
    const top = [...done].sort(
      (a, b) => (b.score ?? -1) - (a.score ?? -1)
    )[0];
    return {
      id: s.id,
      status: s.status,
      candidateCount: s.resume_count,
      completedCount: done.length,
      createdAt: s.created_at,
      jobTitle: s.jobs?.title ?? "Untitled",
      jobKind: s.jobs?.kind ?? "user",
      top: top
        ? {
            name: top.name,
            score: top.score,
            recommendation: top.recommendation,
            status: top.status,
          }
        : null,
    };
  });
}

export default async function DashboardPage() {
  const rows = await loadRows();

  return (
    <Shell>
      <PageHeader
        eyebrow="Screenings"
        title="Public feed of recent screenings."
        description="Every screening lives on a sharable URL. This page lists the most recent 20. Click any row to see the ranking + the model's reasoning."
        actions={
          <>
            <Link href="/new">
              <Button variant="secondary">
                <Plus className="h-3.5 w-3.5" aria-hidden />
                New screening
              </Button>
            </Link>
            <SampleButton />
          </>
        }
      />

      <div className="grid gap-6 px-6 pb-16 pt-8 sm:px-10 lg:grid-cols-[1fr_280px]">
        <RecentScreenings rows={rows} />

        <aside className="flex flex-col gap-4">
          <Card padding="md" className="bg-clay-tint border-clay/20">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
              Try it
            </p>
            <h3 className="mt-2 font-display text-[16px] font-semibold leading-tight text-ink">
              The sample runs in ~10 seconds
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
              Senior Backend Engineer JD against six deliberately varied
              resumes. You&apos;ll see exactly how the rubric calls Hire vs
              Phone screen vs Pass.
            </p>
            <Link
              href="/how"
              className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em] text-clay hover:text-clay-strong"
            >
              Read the prompt
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </Card>

          <Card padding="md">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
              Stats
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <Stat label="Screenings" value={rows.length} />
              <Stat
                label="Candidates"
                value={rows.reduce(
                  (acc, r) => acc + r.candidateCount,
                  0
                )}
              />
            </dl>
          </Card>
        </aside>
      </div>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
        {label}
      </dt>
      <dd className="tabular mt-1 font-display text-[22px] font-semibold text-ink">
        {value}
      </dd>
    </div>
  );
}

