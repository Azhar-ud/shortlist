import { NextResponse, after } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { runScreening } from "@/lib/analyze";
import { SAMPLE_JOB, SAMPLE_RESUMES } from "@/lib/samples";
import { getErrorMessage } from "@/lib/format";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(): Promise<NextResponse> {
  const supabase = getServerSupabase();
  try {
    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .insert({
        title: SAMPLE_JOB.title,
        description: SAMPLE_JOB.description,
        kind: "demo",
      })
      .select("id")
      .single();
    if (jobErr || !job) throw new Error(jobErr?.message ?? "Job insert failed");

    const { data: screening, error: scrErr } = await supabase
      .from("screenings")
      .insert({
        job_id: job.id,
        status: "pending",
        resume_count: SAMPLE_RESUMES.length,
      })
      .select("id")
      .single();
    if (scrErr || !screening)
      throw new Error(scrErr?.message ?? "Screening insert failed");

    const rows = SAMPLE_RESUMES.map((r, i) => ({
      screening_id: screening.id,
      position: i,
      name: r.name,
      raw_text: r.text,
      status: "queued",
    }));
    const { data: candidates, error: cErr } = await supabase
      .from("candidates")
      .insert(rows)
      .select("id, raw_text");
    if (cErr || !candidates) throw new Error(cErr?.message ?? "Candidate insert failed");

    after(async () => {
      await runScreening(
        { id: job.id, title: SAMPLE_JOB.title, description: SAMPLE_JOB.description },
        candidates
      );
    });

    return NextResponse.json({
      success: true,
      data: { id: screening.id },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
