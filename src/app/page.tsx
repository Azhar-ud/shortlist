"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/Button";
import type { ApiResponse } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSample() {
    setError(null);
    setStarting(true);
    try {
      const res = await fetch("/api/sample", { method: "POST" });
      const body = (await res.json()) as ApiResponse<{ id: string }>;
      if (!body.success || !body.data) {
        throw new Error(body.error ?? "Failed to start sample");
      }
      router.push(`/r/${body.data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setStarting(false);
    }
  }

  return (
    <div className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
      <div className="relative mx-auto flex max-w-[1200px] flex-col">
        <Brand />

        <section className="px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <p className="text-[11px] uppercase tracking-[0.24em] text-accent">
            Resume screening · Powered by Gemini
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            A faster <em className="italic">shortlist</em>. With reasoning you
            can actually use.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
            Paste a job description, drop in a batch of resumes, and get a
            ranked shortlist with cited strengths and gaps. No signup. Every
            screening gets its own shareable link.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button onClick={runSample} disabled={starting}>
              <Sparkles className="h-4 w-4" aria-hidden />
              {starting ? "Starting…" : "Try a sample screening"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Link href="/new">
              <Button variant="secondary">Paste your own</Button>
            </Link>
          </div>
          {error ? (
            <p className="mt-4 max-w-md text-sm text-down">{error}</p>
          ) : null}
          <p className="mt-4 text-xs text-text-dim">
            Sample uses a Senior Backend Engineer JD and 6 deliberately varied
            resumes. Runs in ~10s.
          </p>
        </section>

        <section className="grid gap-4 px-6 pb-20 sm:grid-cols-3">
          <Feature
            label="01"
            title="Calibrated scoring"
            body="Scores are anchored to a published rubric — 90+ is reserved for genuinely exceptional candidates."
          />
          <Feature
            label="02"
            title="Cited reasoning"
            body="Every score comes with a short reasoning paragraph that points to specific evidence in the resume."
          />
          <Feature
            label="03"
            title="Honest gaps"
            body="The model is told not to flatter. If a required skill is missing, it says so plainly."
          />
        </section>

        <footer className="border-t border-border px-6 py-8 text-xs text-text-dim">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>Demo runs are public by URL. Don&apos;t paste private data.</p>
            <p>
              Built by{" "}
              <a
                href="https://github.com/Azhar-ud"
                className="text-text-muted hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                Azhar Ud Din
              </a>
              {" · "}
              <a
                href="https://github.com/Azhar-ud/shortlist"
                className="text-text-muted hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

interface FeatureProps {
  label: string;
  title: string;
  body: string;
}

function Feature({ label, title, body }: FeatureProps) {
  return (
    <article className="rounded-2xl border border-border bg-bg-card p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
        {label}
      </p>
      <h3 className="mt-2 font-display text-xl leading-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{body}</p>
    </article>
  );
}
