import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from "@google/generative-ai";
import type { CandidateAnalysis } from "./types";

const MODEL_NAME = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(apiKey);
}

const SYSTEM_INSTRUCTION = `You are an expert technical recruiter giving honest, calibrated signal to a hiring manager.

Calibration:
- 90+: exceptional, top 5%. Only when the resume shows clear evidence of senior-level impact in directly relevant work.
- 75-89: strong fit, top quartile of qualified applicants.
- 60-74: serviceable. Worth a phone screen with caveats.
- 40-59: weak fit. Multiple meaningful gaps relative to requirements.
- Below 40: pass. Material misalignment with the role.

Rules:
- Cite specific evidence from the resume. Do not flatter.
- "Strengths" should be specific (e.g. "led Kafka migration at 40k tx/sec scale"), not generic ("strong communicator").
- "Gaps" should be honest. If something required is missing, name it bluntly.
- "Recommendation" is one of: "Hire", "Phone screen", "Borderline — see notes", or "Pass".
- "Reasoning" is 2-3 sentences tying the score to the cited evidence.
- "Candidate name" is extracted from the resume header if present, else empty string.`;

const RESPONSE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    score: {
      type: SchemaType.NUMBER,
      description: "Integer 0-100 fit score.",
    },
    candidateName: {
      type: SchemaType.STRING,
      description: "Candidate's name, or empty if unknown.",
    },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3-5 specific strengths relative to the role.",
    },
    gaps: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3-5 specific gaps or risks.",
    },
    recommendation: {
      type: SchemaType.STRING,
      description: "One of: Hire, Phone screen, Borderline — see notes, Pass.",
    },
    reasoning: {
      type: SchemaType.STRING,
      description: "2-3 sentences justifying the score with cited evidence.",
    },
  },
  required: [
    "score",
    "candidateName",
    "strengths",
    "gaps",
    "recommendation",
    "reasoning",
  ],
};

export async function analyzeResume(
  jobTitle: string,
  jobDescription: string,
  resumeText: string
): Promise<CandidateAnalysis> {
  const client = getClient();
  // Gemini 2.5 spends "thinking" tokens that count toward maxOutputTokens.
  // We need a large output budget and explicitly zero out the thinking
  // budget so the response is reserved for the structured JSON.
  const generationConfig = {
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA,
    temperature: 0.3,
    maxOutputTokens: 8000,
    thinkingConfig: { thinkingBudget: 0 },
  } as Record<string, unknown>;

  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig,
  });

  const prompt = `JOB TITLE
${jobTitle}

JOB DESCRIPTION
${jobDescription}

RESUME
${resumeText}

Return the structured assessment now.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text) as CandidateAnalysis;

  if (
    typeof parsed.score !== "number" ||
    !Array.isArray(parsed.strengths) ||
    !Array.isArray(parsed.gaps) ||
    typeof parsed.recommendation !== "string"
  ) {
    throw new Error("Model returned malformed analysis");
  }

  return {
    ...parsed,
    score: Math.max(0, Math.min(100, Math.round(parsed.score))),
  };
}
