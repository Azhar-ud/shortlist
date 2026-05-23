export interface SampleResume {
  name: string;
  text: string;
}

export const SAMPLE_JOB = {
  title: "Senior Backend Engineer — Distributed Systems",
  description: `We're a Series B fintech building real-time payment infrastructure that processes $1B+/day. We need a senior backend engineer to lead our event-streaming platform.

What you'll do
- Design and operate event-streaming infrastructure (Kafka, Flink) at high throughput
- Lead architectural decisions for settlement and reconciliation systems
- Mentor 3-5 mid-level engineers
- Own production reliability — on-call rotation, incident response, postmortems

Required
- 5+ years backend, including 2+ on distributed systems at scale
- Production experience with Kafka, Flink, or similar streaming systems
- Strong Go or Java; we work primarily in Go
- Track record of designing systems that handle 10k+ events/second
- Comfortable with on-call

Nice to have
- Fintech or payments background
- Open-source contributions to streaming/database ecosystems
- Experience leading platform migrations`,
};

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    name: "Priya Iyer",
    text: `Priya Iyer — Senior Backend Engineer
priya.iyer@example.com · github.com/priyaiyer · 8 years exp

EXPERIENCE
Stripe (2021–present) — Staff Engineer, Payments Platform
- Designed and built the event-streaming layer that processes 45k tx/sec across Kafka + Flink
- Led a 6-month migration from Kinesis to Kafka with zero customer-visible downtime
- Mentored 4 engineers from mid to senior level
- Primary on-call for the highest-tier settlement service

Confluent (2019–2021) — Senior Engineer, Kafka Streams
- Core contributor to Kafka Streams; merged ~30 PRs to apache/kafka
- Owned the exactly-once-semantics implementation upgrade
- Authored the Confluent blog post on EOS that drove 200k+ reads

Cloudera (2016–2019) — Engineer
- Worked on impala query engine in C++ and Java

SKILLS
Go (primary), Java, Kafka, Flink, Kubernetes, PostgreSQL, Terraform

EDUCATION
B.Tech CS, IIT Bombay (2014)`,
  },
  {
    name: "Marcus Williams",
    text: `Marcus Williams — Backend Engineer
marcus.w@example.com · 7 years exp · Atlanta, GA

EXPERIENCE
SunTrust → Truist Bank (2018–present) — Senior Software Engineer
- Built and maintained core retail-banking microservices in Spring Boot
- Owned the fraud-detection batch pipeline (nightly Spark jobs over ~50M tx)
- Helped migrate legacy WebSphere monolith to AWS ECS
- Mentored 2 juniors on Spring patterns and code review

Equifax (2015–2018) — Java Engineer
- Built credit-report ingestion services
- Optimized PL/SQL stored procedures driving reporting workloads

SKILLS
Java (Spring Boot), Python, Spark, AWS (ECS, RDS), PostgreSQL, Jenkins, light Kafka
exposure (consumer side only)

EDUCATION
B.S. Computer Science, Georgia Tech (2015)`,
  },
  {
    name: "Asha Singh",
    text: `Asha Singh — Frontend Developer
asha@example.com · 2 years exp · Remote

EXPERIENCE
Plaid Studio (2024–present) — Junior Frontend Engineer
- React + Next.js for marketing pages and internal admin tools
- Tailwind, TanStack Query, Vercel deployments
- Wrote ~40% of frontend test coverage from scratch using Vitest

Bootcamp project showcase
- Cloned the Stripe dashboard UI in React (open-source)
- Built a Discord-bot interface in TypeScript

SKILLS
TypeScript, React, Next.js, Tailwind, Node.js (basic), Figma

EDUCATION
Lambda School (2023)
B.A. English, UC Davis (2020)`,
  },
  {
    name: "Daniel Park",
    text: `Daniel Park — Distributed Systems Engineer
daniel.park@example.com · github.com/danpark · 6 years exp

EXPERIENCE
Confluent (2020–present) — Staff Engineer, Streams Platform
- Tech lead for Kafka Streams runtime team (4 ICs reporting to me directly)
- Designed the new state-store rebalancing protocol that landed in Kafka 3.7
- Frequent speaker (Kafka Summit 2023, 2024) on EOS and consumer-group internals
- On-call lead for the managed Streams service (~200 enterprise customers)

Lyft (2018–2020) — Engineer, Real-time Pricing
- Built the surge-pricing event-streaming pipeline (Go + Kafka)
- ~12k events/sec sustained, 60k peaks
- Production debugging during P0 incidents on the pricing path

SKILLS
Go (primary), Java, Kafka, Flink, gRPC, Kubernetes, eBPF (curious-level)

OSS
- apache/kafka: 50+ merged commits
- linkedin/cruise-control: minor contributions
- own: github.com/danpark/streams-bench (4k stars)

EDUCATION
M.S. Computer Science, CMU (2018)`,
  },
  {
    name: "Sofia Costa",
    text: `Sofia Costa — Senior Systems Engineer
sofia.costa@example.com · 9 years exp · Lisbon

EXPERIENCE
Cloudflare (2022–present) — Systems Engineer, Workers Runtime
- Rust engineer working on the Workers V8 isolate runtime
- Owned the queues product launch from prototype to GA
- Contributed to the open-source workerd project

Mozilla (2017–2022) — Senior Engineer, Firefox Networking
- Rust + C++ on the Necko networking stack
- HTTP/3 implementation, QUIC contributions

OSS
- workerd (Cloudflare): 80+ merged PRs
- mozilla-central: long-time contributor
- own: rust-systems blog with 30 long-form posts

SKILLS
Rust (primary, 6+ years production), C++, Go (basic — toy projects only),
distributed-systems theory, networking, low-level performance work

EDUCATION
M.S. Distributed Systems, IST Lisbon (2016)`,
  },
  {
    name: "Jordan Kim",
    text: `Jordan Kim — Data Analyst
jordan.kim@example.com · 3 years exp · Vancouver

EXPERIENCE
Shopify (2023–present) — Analytics Engineer, Merchant Insights
- SQL-heavy analyses for the merchant-success team
- dbt models, Looker dashboards
- Some Python (pandas) for ad-hoc work

Hootsuite (2021–2023) — Data Analyst
- Marketing-attribution analyses, primarily in SQL
- Owned monthly board-deck data pulls

SKILLS
SQL (advanced), Python (pandas, notebook-level), dbt, Looker, Excel power-user

EDUCATION
B.Com Business Analytics, UBC (2021)`,
  },
];
