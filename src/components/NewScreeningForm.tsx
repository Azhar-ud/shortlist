"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { ApiResponse } from "@/lib/types";

const RESUME_DELIMITER = "---";

export function NewScreeningForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resumes, setResumes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [samplingDemo, setSamplingDemo] = useState(false);
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

  async function runSample() {
    setSamplingDemo(true);
    setError(null);
    try {
      const res = await fetch("/api/sample", { method: "POST" });
      const body = (await res.json()) as ApiResponse<{ id: string }>;
      if (!body.success || !body.data) {
        throw new Error(body.error ?? "Failed");
      }
      router.push(`/r/${body.data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setSamplingDemo(false);
    }
  }

  return (
    <div className="grid gap-6 px-6 pb-20 lg:grid-cols-[1fr_320px] sm:px-10">
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <Card padding="lg">
          <div className="flex flex-col gap-6">
            <Field label="Job title" hint="Concise role name">
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Backend Engineer"
              />
            </Field>

            <Field
              label="Job description"
              hint="Paste full text including nice-to-haves"
            >
              <Textarea
                required
                rows={9}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What you'll do, requirements, nice-to-haves…"
              />
            </Field>

            <Field
              label={`Resumes (${parsedResumes.length})`}
              hint={
                <>
                  Separate with{" "}
                  <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-[10px]">
                    ---
                  </code>{" "}
                  on its own line
                </>
              }
            >
              <Textarea
                required
                rows={14}
                value={resumes}
                onChange={(e) => setResumes(e.target.value)}
                placeholder={"Resume 1 text…\n\n---\n\nResume 2 text…"}
                className="font-mono text-[12.5px]"
              />
            </Field>

            {error ? (
              <p className="rounded-[10px] border border-bad/30 bg-bad-soft px-4 py-2.5 text-[13px] text-bad">
                {error}
              </p>
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={runSample}
                disabled={samplingDemo || submitting}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                {samplingDemo ? "Starting sample…" : "Try the sample instead"}
              </Button>
              <Button type="submit" disabled={submitting || samplingDemo}>
                {submitting ? "Starting…" : "Run screening"}
              </Button>
            </div>
          </div>
        </Card>
      </form>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <Card padding="md">
          <h3 className="font-display text-[15px] font-semibold text-ink">
            Tips
          </h3>
          <ul className="mt-3 flex flex-col gap-3 text-[13px] leading-relaxed text-ink-muted">
            <Tip n="01" body="Paste the JD verbatim. The model uses the same language to anchor 'specific' strengths/gaps." />
            <Tip n="02" body="One resume per block, separated by --- on its own line. Plain text only." />
            <Tip n="03" body="6-12 resumes is the sweet spot. The model uses parallel calls, so total time is dominated by the slowest one." />
          </ul>
        </Card>
        <Card padding="md">
          <h3 className="font-display text-[15px] font-semibold text-ink">
            How it scores
          </h3>
          <ul className="mt-3 flex flex-col gap-2 font-mono text-[12px] text-ink-muted">
            <li><span className="text-ink">90+</span> exceptional, rare</li>
            <li><span className="text-ink">75–89</span> strong fit</li>
            <li><span className="text-ink">60–74</span> phone-screen-worthy</li>
            <li><span className="text-ink">40–59</span> weak fit</li>
            <li><span className="text-ink">&lt;40</span> pass</li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}

function Tip({ n, body }: { n: string; body: string }) {
  return (
    <li className="flex gap-2.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
        {n}
      </span>
      <span>{body}</span>
    </li>
  );
}
