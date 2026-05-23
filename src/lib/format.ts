export function scoreClass(score: number | null | undefined): string {
  if (score == null) return "score-hue-low";
  if (score >= 75) return "score-hue-high";
  if (score >= 55) return "score-hue-mid";
  return "score-hue-low";
}

export function recommendationLabel(rec: string | null | undefined): string {
  if (!rec) return "—";
  return rec.trim();
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unexpected error";
}
