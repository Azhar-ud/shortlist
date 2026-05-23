import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { rowToCandidate } from "@/lib/analyze";
import { getErrorMessage } from "@/lib/format";
import type { ScreeningView } from "@/lib/types";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _req: Request,
  ctx: RouteContext
): Promise<NextResponse> {
  const { id } = await ctx.params;
  const supabase = getServerSupabase();
  try {
    const { data: screening, error: sErr } = await supabase
      .from("screenings")
      .select("id, job_id, status, resume_count, created_at, completed_at")
      .eq("id", id)
      .single();
    if (sErr || !screening) {
      return NextResponse.json(
        { success: false, error: "Screening not found" },
        { status: 404 }
      );
    }

    const { data: job, error: jErr } = await supabase
      .from("jobs")
      .select("id, title, description, kind, created_at")
      .eq("id", screening.job_id)
      .single();
    if (jErr || !job) throw new Error(jErr?.message ?? "Job missing");

    const { data: candidateRows, error: cErr } = await supabase
      .from("candidates")
      .select("*")
      .eq("screening_id", id)
      .order("position", { ascending: true });
    if (cErr) throw new Error(cErr.message);

    const view: ScreeningView = {
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

    return NextResponse.json({ success: true, data: view });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
