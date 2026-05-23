import { NextResponse, after } from "next/server";
import { z } from "zod";
import { getServerSupabase } from "@/lib/supabase/server";
import { runScreening } from "@/lib/analyze";
import { getErrorMessage } from "@/lib/format";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PayloadSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(20).max(20_000),
  resumes: z.array(z.string().min(20).max(20_000)).min(1).max(12),
});

export async function POST(req: Request): Promise<NextResponse> {
  let payload: z.infer<typeof PayloadSchema>;
  try {
    const json: unknown = await req.json();
    payload = PayloadSchema.parse(json);
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 400 }
    );
  }

  const supabase = getServerSupabase();
  try {
    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .insert({
        title: payload.title,
        description: payload.description,
        kind: "user",
      })
      .select("id")
      .single();
    if (jobErr || !job) throw new Error(jobErr?.message ?? "Job insert failed");

    const { data: screening, error: scrErr } = await supabase
      .from("screenings")
      .insert({
        job_id: job.id,
        status: "pending",
        resume_count: payload.resumes.length,
      })
      .select("id")
      .single();
    if (scrErr || !screening)
      throw new Error(scrErr?.message ?? "Screening insert failed");

    const rows = payload.resumes.map((text, i) => ({
      screening_id: screening.id,
      position: i,
      raw_text: text,
      status: "queued",
    }));
    const { data: candidates, error: cErr } = await supabase
      .from("candidates")
      .insert(rows)
      .select("id, raw_text");
    if (cErr || !candidates) throw new Error(cErr?.message ?? "Candidate insert failed");

    after(async () => {
      await runScreening(
        { id: job.id, title: payload.title, description: payload.description },
        candidates
      );
    });

    return NextResponse.json({ success: true, data: { id: screening.id } });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
