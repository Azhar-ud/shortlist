"use client";

import { useState } from "react";
import clsx from "clsx";
import { Code2, ScrollText, Settings2 } from "lucide-react";
import { Card } from "./ui/Card";

type Tab = "rubric" | "prompt" | "schema";

const RUBRIC = `90+   exceptional, top 5% — clear evidence of senior-level impact in directly relevant work
75–89 strong fit, top quartile of qualified applicants
60–74 serviceable, worth a phone screen with caveats
40–59 weak fit, multiple meaningful gaps relative to requirements
<40   pass, material misalignment with the role`;

const PROMPT = `You are an expert technical recruiter giving honest, calibrated signal
to a hiring manager.

Rules:
- Cite specific evidence from the resume. Do not flatter.
- "Strengths" should be specific (e.g. "led Kafka migration at 40k tx/sec
  scale"), not generic ("strong communicator").
- "Gaps" should be honest. If something required is missing, name it
  bluntly.
- "Recommendation" is one of: "Hire", "Phone screen", "Borderline — see
  notes", or "Pass".
- "Reasoning" is 2-3 sentences tying the score to the cited evidence.
- "Candidate name" is extracted from the resume header if present, else
  empty string.`;

const SCHEMA = `{
  "type": "object",
  "properties": {
    "score":          { "type": "number"  },
    "candidateName":  { "type": "string"  },
    "strengths":      { "type": "array",  "items": { "type": "string" } },
    "gaps":           { "type": "array",  "items": { "type": "string" } },
    "recommendation": { "type": "string"  },
    "reasoning":      { "type": "string"  }
  },
  "required": [
    "score", "candidateName", "strengths",
    "gaps", "recommendation", "reasoning"
  ]
}`;

const TABS: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
  { id: "rubric", label: "Rubric", icon: <ScrollText className="h-[13px] w-[13px]" aria-hidden /> },
  { id: "prompt", label: "System prompt", icon: <Settings2 className="h-[13px] w-[13px]" aria-hidden /> },
  { id: "schema", label: "Response schema", icon: <Code2 className="h-[13px] w-[13px]" aria-hidden /> },
];

const CONTENT: Record<Tab, string> = {
  rubric: RUBRIC,
  prompt: PROMPT,
  schema: SCHEMA,
};

export function BehindTheScreening() {
  const [tab, setTab] = useState<Tab>("rubric");

  return (
    <Card padding="none">
      <header className="border-b border-border px-5 pt-4 pb-0">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">
          <span className="status-dot" style={{ ["--color" as string]: "var(--clay)" }} aria-hidden />
          Behind the screening
        </div>
        <p className="mb-4 text-[13px] leading-relaxed text-ink-muted">
          The exact prompt, rubric, and JSON schema the model sees for every
          candidate. Nothing hidden.
        </p>
        <nav className="flex gap-1 -mb-px" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                "inline-flex items-center gap-1.5 border-b-2 px-3 pb-2.5 pt-1.5 text-[12px] font-medium transition-colors",
                tab === t.id
                  ? "border-clay text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <pre className="max-h-[380px] overflow-auto bg-bg-soft px-5 py-4 font-mono text-[12px] leading-relaxed text-ink whitespace-pre">
        {CONTENT[tab]}
      </pre>
    </Card>
  );
}
