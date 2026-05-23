"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { ApiResponse } from "@/lib/types";

const RESUME_DELIMITER = "---";

export function NewScreeningForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resumes, setResumes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedResumes = resumes
    .split(new RegExp(`^${RESUME_DELIMITER}\\s*$`, "m"))
    .map((s) => s.trim())
    .filter(Boolean);

  async function onSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(null);
    if (parsedResumes.length === 0) {
      setError("Add at least one resume.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, resumes: parsedResumes }),
      });
      const body = (await res.json()) as ApiResponse<{ id: string }>;
      if (!body.success || !body.data) {
        throw new Error(body.error ?? "Failed to create screening");
      }
      router.push(`/r/${body.data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pb-20 pt-10">
      <header>
        <p className="text-[11px] uppercase tracking-[0.22em] text-accent">
          New screening
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">
          Paste a job description and resumes.
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          The model will rank candidates with structured reasoning. Separate
          multiple resumes with a line containing only{" "}
          <code className="rounded bg-bg-card px-1 font-mono text-xs">---</code>.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
          Job title
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Senior Backend Engineer"
          className="rounded-lg border border-border bg-bg-card px-4 py-2.5 text-sm text-text outline-none placeholder:text-text-dim focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
          Job description
        </label>
        <textarea
          required
          rows={8}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste the full job description, including requirements and nice-to-haves…"
          className="rounded-lg border border-border bg-bg-card px-4 py-3 text-sm leading-relaxed text-text outline-none placeholder:text-text-dim focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
            Resumes ({parsedResumes.length})
          </label>
          <span className="font-mono text-[10px] text-text-dim">
            Separate with --- on its own line
          </span>
        </div>
        <textarea
          required
          rows={14}
          value={resumes}
          onChange={(e) => setResumes(e.target.value)}
          placeholder="Resume 1 text…\n\n---\n\nResume 2 text…"
          className="rounded-lg border border-border bg-bg-card px-4 py-3 font-mono text-xs leading-relaxed text-text outline-none placeholder:text-text-dim focus:border-accent"
        />
      </div>

      {error ? (
        <p className="rounded-lg border border-down/30 bg-down/10 px-4 py-3 text-sm text-down">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Starting…" : "Run screening"}
        </Button>
      </div>
    </form>
  );
}
