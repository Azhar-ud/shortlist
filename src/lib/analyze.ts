import { getServerSupabase } from "./supabase/server";
import { analyzeResume } from "./gemini";
import { getErrorMessage } from "./format";
import type { Candidate, Job } from "./types";

interface CandidateRow {
  id: string;
  raw_text: string;
}

export async function runScreening(
  job: Pick<Job, "id" | "title" | "description">,
  candidates: readonly CandidateRow[]
): Promise<void> {
  const supabase = getServerSupabase();

  await supabase
    .from("screenings")
    .update({ status: "running" })
    .eq("job_id", job.id);

  await Promise.all(
    candidates.map(async (c) => {
      await supabase
        .from("candidates")
        .update({ status: "analyzing" })
        .eq("id", c.id);

      try {
        const analysis = await analyzeResume(
          job.title,
          job.description,
          c.raw_text
        );
        await supabase
          .from("candidates")
          .update({
            status: "done",
            score: analysis.score,
            name: analysis.candidateName || null,
            strengths: analysis.strengths,
            gaps: analysis.gaps,
            recommendation: analysis.recommendation,
            reasoning: analysis.reasoning,
            processed_at: new Date().toISOString(),
          })
          .eq("id", c.id);
      } catch (error: unknown) {
        await supabase
          .from("candidates")
          .update({
            status: "error",
            error: getErrorMessage(error),
            processed_at: new Date().toISOString(),
          })
          .eq("id", c.id);
      }
    })
  );

  await supabase
    .from("screenings")
    .update({
      status: "done",
      completed_at: new Date().toISOString(),
    })
    .eq("job_id", job.id);
}

export function rowToCandidate(row: Record<string, unknown>): Candidate {
  return {
    id: row.id as string,
    screeningId: row.screening_id as string,
    position: row.position as number,
    name: (row.name as string | null) ?? null,
    rawText: row.raw_text as string,
    score: (row.score as number | null) ?? null,
    strengths: (row.strengths as string[] | null) ?? null,
    gaps: (row.gaps as string[] | null) ?? null,
    recommendation: (row.recommendation as string | null) ?? null,
    reasoning: (row.reasoning as string | null) ?? null,
    status: row.status as Candidate["status"],
    error: (row.error as string | null) ?? null,
    processedAt: (row.processed_at as string | null) ?? null,
  };
}
