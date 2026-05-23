import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Shell, PageHeader } from "@/components/Shell";
import { Card } from "@/components/ui/Card";
import { BehindTheScreening } from "@/components/BehindTheScreening";
import { Button } from "@/components/ui/Button";

export default function HowItWorksPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="How it works"
        title="Every choice, made on purpose."
        description="The point of a portfolio demo is to show the engineering. Below is the exact rubric, prompt, and JSON schema the model sees. Nothing hidden."
        actions={
          <Link href="/new">
            <Button>
              Run a screening
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 px-6 pb-20 pt-10 sm:px-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-6">
          <Section
            n="01"
            title="One Gemini call per candidate, in parallel"
            body={
              <>
                Each resume gets its own call to{" "}
                <code className="rounded bg-bg-soft px-1 py-0.5 font-mono text-[12px]">
                  gemini-2.5-flash
                </code>{" "}
                with a constrained{" "}
                <code className="rounded bg-bg-soft px-1 py-0.5 font-mono text-[12px]">
                  responseSchema
                </code>{" "}
                — the model is forced to return shape-correct JSON so the
                parser is trivial.
              </>
            }
          />
          <Section
            n="02"
            title="Background work via next/server after()"
            body={
              <>
                POST /api/screenings inserts the rows and schedules the
                analysis via Next.js{" "}
                <code className="rounded bg-bg-soft px-1 py-0.5 font-mono text-[12px]">
                  after()
                </code>
                . The request returns the screening ID in ~80ms; the model
                runs to completion in the same lambda invocation after the
                response is sent.
              </>
            }
          />
          <Section
            n="03"
            title="Calibrated rubric anchors the scores"
            body="System prompt anchors scoring bands explicitly — 90+ is exceptional and rare. Without anchoring, every candidate trends toward 78-85. The rubric is what makes the rankings actionable."
          />
          <Section
            n="04"
            title="Honesty over flattery"
            body="The prompt forbids generic praise. 'Strong communicator' isn't a strength; 'led the Kafka migration at 40k tx/sec' is. Gaps are stated plainly. If a required skill is absent, the model says so."
          />
          <Section
            n="05"
            title="RLS on, writes via service role"
            body={
              <>
                Public-read on{" "}
                <code className="rounded bg-bg-soft px-1 py-0.5 font-mono text-[12px]">
                  jobs / screenings / candidates
                </code>{" "}
                — anyone with a URL can view, no one with the anon key can
                write. Every mutation goes through a server route with the
                service role.
              </>
            }
          />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <BehindTheScreening />
        </div>
      </div>

      <section className="border-t border-border bg-bg-soft px-6 py-12 sm:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
          Stack
        </p>
        <h2 className="mt-2 font-display text-[24px] font-semibold leading-tight text-ink">
          Pieces in motion
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Framework", value: "Next.js 16 · App Router" },
            { label: "Model", value: "Gemini 2.5 Flash · free tier" },
            { label: "Database", value: "Supabase Postgres · RLS on" },
            { label: "Style", value: "Tailwind v4 · OKLCH tokens" },
          ].map((p) => (
            <Card key={p.label} padding="md">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
                {p.label}
              </p>
              <p className="mt-1 text-[13.5px] text-ink">{p.value}</p>
            </Card>
          ))}
        </div>
      </section>
    </Shell>
  );
}

function Section({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <Card padding="lg">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[12px] tracking-wider text-clay">
          {n}
        </span>
        <h3 className="font-display text-[18px] font-semibold leading-tight text-ink">
          {title}
        </h3>
      </div>
      <p className="mt-2 ml-8 text-[14px] leading-relaxed text-ink-muted">
        {body}
      </p>
    </Card>
  );
}
