export type CandidateStatus = "queued" | "analyzing" | "done" | "error";
export type ScreeningStatus = "pending" | "running" | "done" | "error";
export type JobKind = "demo" | "user";

export interface Job {
  id: string;
  title: string;
  description: string;
  kind: JobKind;
  createdAt: string;
}

export interface Screening {
  id: string;
  jobId: string;
  status: ScreeningStatus;
  resumeCount: number;
  createdAt: string;
  completedAt: string | null;
}

export interface Candidate {
  id: string;
  screeningId: string;
  position: number;
  name: string | null;
  rawText: string;
  score: number | null;
  strengths: string[] | null;
  gaps: string[] | null;
  recommendation: string | null;
  reasoning: string | null;
  status: CandidateStatus;
  error: string | null;
  processedAt: string | null;
}

export interface ScreeningView {
  job: Job;
  screening: Screening;
  candidates: Candidate[];
}

export interface CandidateAnalysis {
  score: number;
  candidateName: string;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  reasoning: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
