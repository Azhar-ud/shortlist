# Shortlist

[![e2e](https://github.com/Azhar-ud/portfolio-demos-e2e/actions/workflows/test.yml/badge.svg)](https://github.com/Azhar-ud/portfolio-demos-e2e/actions/workflows/test.yml)

An AI screening copilot. Paste a job description, drop in a batch of resumes,
and get a ranked shortlist with cited strengths, gaps, and reasoning. No
signup required.

Built as a portfolio demo to show LLM integration, structured-output design,
multi-tenant data modeling with Supabase, and live UI driven by background
work.

## Live demo

→ https://shortlist-demo.vercel.app

Click **Try a sample screening** to see the product run end-to-end in ~10s.

## What it does

1. You provide a JD and N resumes (paste as text).
2. The server kicks off a background analysis pass that calls Gemini Flash
   once per candidate, using a constrained JSON schema and a calibrated rubric.
3. The UI polls and progressively renders ranked results as each candidate
   finishes — with score, top strengths, top gaps, and a one-line
   recommendation.
4. Export the ranked list as CSV. Share the URL with your team.

## Stack

- **Next.js 16** (App Router, Turbopack, `after()` for background work)
- **TypeScript** end-to-end, Zod validation at the API edge, no `any`
- **Tailwind v4** with OKLCH design tokens — dark editorial palette with an
  emerald accent
- **Supabase** Postgres for `jobs`, `screenings`, `candidates`; RLS enabled
  with public-read policies so demo URLs are shareable, writes are
  server-side only
- **Google Gemini 2.5 Flash** with `responseSchema` for structured JSON
  output (free tier — no credit card)
- **SWR** for client polling

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── sample/route.ts            ── one-click sample run
│   │   ├── screenings/route.ts        ── user-input screening
│   │   └── screenings/[id]/route.ts   ── poll endpoint
│   ├── new/page.tsx                   ── paste JD + resumes
│   ├── r/[id]/page.tsx                ── results page (SSR initial + client poll)
│   ├── globals.css                    ── design tokens
│   ├── layout.tsx                     ── Geist + Instrument Serif
│   └── page.tsx                       ── landing
├── components/
│   ├── Brand.tsx
│   ├── ui/                            ── Button, ScoreRing
│   ├── CandidateRow.tsx
│   ├── NewScreeningForm.tsx
│   └── ResultsView.tsx                ── client polling + CSV export
└── lib/
    ├── supabase/{server,public}.ts
    ├── gemini.ts                      ── structured-output prompt + schema
    ├── analyze.ts                     ── background screening runner
    ├── samples.ts                     ── seeded JD + 6 sample resumes
    ├── types.ts
    └── format.ts
```

### Flow

1. `POST /api/sample` (or `/api/screenings`) inserts the job, screening, and
   candidate rows in pending state, then schedules `runScreening()` via
   Next.js `after()` so the response can return immediately with the
   screening ID.
2. The page redirects to `/r/[id]`. The server component does the initial
   fetch from Postgres; the client component uses SWR with a 2-second
   refresh interval until `status === "done"`.
3. `runScreening()` updates each candidate's `status` to `analyzing`, calls
   Gemini with a constrained `responseSchema`, and writes the resulting
   `score / strengths / gaps / recommendation / reasoning` back into the row.
4. When all candidates have completed, the screening is marked `done`.

### Why structured output

The Gemini call uses `responseMimeType: "application/json"` plus a
`responseSchema`. The model is forced to return shape-correct JSON so the
parser is trivial and the UI can render without any "what does the model
mean" gymnastics.

### Why background work via `after()`

Calling N Gemini requests synchronously would tie up the original POST
request for ~10 seconds. `after()` lets the API respond with the screening
ID instantly, the user gets the live results page immediately, and the
analysis runs to completion in the same function invocation after the
response is sent. Vercel keeps the lambda warm until the work is done
(capped by `maxDuration = 60`).

## Run locally

```bash
cp .env.local.example .env.local
# fill in the four env vars
npm install
npm run dev
```

The free Google Gemini key is rate-limited but generous enough for ongoing
demo use. The Supabase free tier is more than enough.

## Schema

```sql
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  kind text not null default 'user',   -- 'demo' | 'user'
  created_at timestamptz default now()
);

create table public.screenings (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs on delete cascade,
  status text not null default 'pending',
  resume_count int not null default 0,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  screening_id uuid not null references public.screenings on delete cascade,
  position int not null,
  name text,
  raw_text text not null,
  score numeric,
  strengths text[],
  gaps text[],
  recommendation text,
  reasoning text,
  status text not null default 'queued',
  error text,
  created_at timestamptz default now(),
  processed_at timestamptz
);
```

RLS is enabled with `select using (true)` policies on all three tables.
Writes have no policy, so they can only happen via the service-role key
(server-only) — anon clients can read by ID but cannot create or modify.

## License

MIT
