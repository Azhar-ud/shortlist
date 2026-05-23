import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Shell, PageHeader } from "@/components/Shell";
import { ResultsView } from "@/components/ResultsView";
import { getServerSupabase } from "@/lib/supabase/server";
import { rowToCandidate } from "@/lib/analyze";
import type { ScreeningView } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function loadView(id: string): Promise<ScreeningView | null> {
  const supabase = getServerSupabase();
  const { data: screening } = await supabase
    .from("screenings")
    .select("id, job_id, status, resume_count, created_at, completed_at")
    .eq("id", id)
    .maybeSingle();
  if (!screening) return null;

  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, description, kind, created_at")
    .eq("id", screening.job_id)
    .single();
  if (!job) return null;

  const { data: candidateRows } = await supabase
    .from("candidates")
    .select("*")
    .eq("screening_id", id)
    .order("position", { ascending: true });

  return {
    job: {
      id: job.id,
      title: job.title,
      description: job.description,
      kind: job.kind,
      createdAt: job.created_at,
    },
    screening: {
      id: screening.id,
      jobId: screening.job_id,
      status: screening.status,
      resumeCount: screening.resume_count,
      createdAt: screening.created_at,
      completedAt: screening.completed_at,
    },
    candidates: (candidateRows ?? []).map(rowToCandidate),
  };
}

export default async function ResultsPage({ params }: PageProps) {
  const { id } = await params;
  const view = await loadView(id);
  if (!view) notFound();

  return (
    <Shell>
      <PageHeader
        eyebrow={
          <Breadcrumb
            kind={view.job.kind}
            title={view.job.title}
          />
        }
        title={view.job.title}
      />
      <ResultsView id={id} initial={view} />
    </Shell>
  );
}

function Breadcrumb({ kind, title }: { kind: "demo" | "user"; title: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <Link href="/dashboard" className="hover:text-clay-strong">
        Screenings
      </Link>
      <ChevronRight className="h-3 w-3 text-ink-faint" aria-hidden />
      <span className="text-ink-dim normal-case tracking-normal">
        {kind === "demo" ? "Sample · " : ""}
        {title}
      </span>
    </span>
  );
}
