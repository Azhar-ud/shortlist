"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  Code2,
  FileSearch,
  Gauge,
  Quote,
  Sparkles,
} from "lucide-react";
import { Shell, PageHeader } from "@/components/Shell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreDial } from "@/components/ScoreDial";
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
    <Shell>
      <PageHeader
        eyebrow="Overview · Demo build"
        title={
          <>
            Calibrated AI screening that{" "}
            <span className="text-clay">cites its work.</span>
          </>
        }
        description="Drop in a job description and a stack of resumes. Get a ranked shortlist with strengths, gaps, and recommendation — each anchored to specific resume evidence. No signup."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => router.push("/new")}
            >
              Paste your own
            </Button>
            <Button onClick={runSample} disabled={starting}>
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {starting ? "Starting…" : "Try the sample"}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </>
        }
      />

      {error ? (
        <div className="px-6 pt-4 sm:px-10">
          <p className="inline-block rounded-[10px] border border-bad/30 bg-bad-soft px-3 py-2 text-[13px] text-bad">
            {error}
          </p>
        </div>
      ) : null}

      <section className="grid gap-6 px-6 pb-16 pt-10 sm:px-10 lg:grid-cols-[1fr_360px]">
        {/* The demo "screenshot" — actually live components composed to look like a result */}
        <PreviewCard />

        <div className="flex flex-col gap-4">
          <Card padding="lg">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
              The brief
            </p>
            <p className="mt-2 font-display text-[18px] leading-snug text-ink">
              Recruiters waste hours on resumes the model can rank in twelve
              seconds.
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-muted">
              Shortlist is a portfolio demo built on Next.js 16, Supabase, and
              Gemini 2.5 Flash. Background analysis via{" "}
              <code className="rounded bg-bg-soft px-1 py-0.5 font-mono text-[11px]">
                after()
              </code>{" "}
              streams results to the dashboard while the API call returns
              instantly.
            </p>
          </Card>

          <Card padding="lg">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
              What buyers see
            </p>
            <ul className="mt-3 flex flex-col gap-2.5 text-[13.5px] leading-relaxed">
              {[
                "Score with cited reasoning, not vibes",
                "Honest gaps — model is told not to flatter",
                "Calibrated rubric, not a Likert scale",
                "Structured output — JSON schema, no LLM parsing tricks",
                "Background work — POST returns in 80ms",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-ink-muted"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="border-t border-border bg-bg-soft px-6 py-16 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-clay">
          Three ingredients
        </p>
        <h2 className="mt-2 font-display text-[28px] font-semibold leading-tight text-ink sm:text-[36px]">
          What makes the rankings worth reading.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Ingredient
            icon={<Gauge className="h-4 w-4" />}
            label="01 · Rubric"
            title="Calibrated scoring"
            body="90+ reserved for genuinely exceptional candidates. Most stay below 80. Score creep is the death of AI screening."
          />
          <Ingredient
            icon={<Quote className="h-4 w-4" />}
            label="02 · Citation"
            title="Reasoning with evidence"
            body="Every score points to specific phrases from the resume. 'Strong communicator' is banned; 'led the Kafka migration at 40k tx/sec' is the standard."
          />
          <Ingredient
            icon={<FileSearch className="h-4 w-4" />}
            label="03 · Honesty"
            title="Gaps are named bluntly"
            body="If a required skill is missing, the model says so. No 'transferable skills' theater."
          />
        </div>
        <Link
          href="/how"
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-clay hover:text-clay-strong"
        >
          <Code2 className="h-3.5 w-3.5" aria-hidden />
          Read the prompt + schema →
        </Link>
      </section>

      <footer className="border-t border-border bg-bg px-6 py-8 text-[12px] text-ink-dim sm:px-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Demo screenings live at public URLs. Don&apos;t paste real
            applicant data.
          </p>
          <p>
            Built by{" "}
            <a
              href="https://github.com/Azhar-ud"
              className="text-ink-muted hover:text-clay"
              target="_blank"
              rel="noopener noreferrer"
            >
              Azhar Ud Din
            </a>
            {" · "}
            <a
              href="https://github.com/Azhar-ud/shortlist"
              className="text-ink-muted hover:text-clay"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </a>
          </p>
        </div>
      </footer>
    </Shell>
  );
}

interface IngredientProps {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
}

function Ingredient({ icon, label, title, body }: IngredientProps) {
  return (
    <Card padding="lg">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-clay-soft text-clay">
          {icon}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
          {label}
        </span>
      </div>
      <h3 className="mt-3 font-display text-[18px] font-semibold leading-tight text-ink">
        {title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">{body}</p>
    </Card>
  );
}

/**
 * A tasteful inline preview using the actual ScoreDial + Badge components,
 * so the landing page shows the product's voice without screenshots.
 */
function PreviewCard() {
  const rows = [
    { name: "Daniel Park", role: "Confluent · Staff", score: 95, rec: "Hire" },
    { name: "Priya Iyer", role: "Stripe · Staff", score: 95, rec: "Hire" },
    { name: "Sofia Costa", role: "Cloudflare · Rust", score: 65, rec: "Phone screen" },
    { name: "Marcus Williams", role: "Truist · Java", score: 65, rec: "Phone screen" },
    { name: "Asha Singh", role: "Plaid · Junior", score: 30, rec: "Pass" },
    { name: "Jordan Kim", role: "Shopify · Analyst", score: 30, rec: "Pass" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card padding="none">
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Badge tone="good" dot>
              done
            </Badge>
            <span className="font-mono text-[11.5px] text-ink-muted">
              <span className="text-ink">6</span>
              <span className="text-ink-dim">/6</span> analyzed
            </span>
            <span className="text-[11.5px] text-ink-dim">
              senior backend engineer
            </span>
          </div>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim sm:inline">
            preview
          </span>
        </header>
        <ol className="divide-y divide-border">
          {rows.map((r, i) => (
            <motion.li
              key={r.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1 + i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-4 px-5 py-3"
            >
              <span className="tabular w-6 font-mono text-[11px] text-ink-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <ScoreDial score={r.score} size={44} label="" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[15px] font-semibold text-ink">
                  {r.name}
                </p>
                <p className="font-mono text-[11px] text-ink-dim">{r.role}</p>
              </div>
              <Badge
                tone={
                  r.rec === "Hire"
                    ? "good"
                    : r.rec === "Pass"
                      ? "bad"
                      : "clay"
                }
              >
                {r.rec}
              </Badge>
            </motion.li>
          ))}
        </ol>
        <footer className="flex items-center justify-between border-t border-border bg-bg-soft px-5 py-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-dim">
            CSV · share · open
          </span>
          <span className="font-mono text-[11px] text-clay">
            7.4s end-to-end ↗
          </span>
        </footer>
      </Card>
    </motion.div>
  );
}
