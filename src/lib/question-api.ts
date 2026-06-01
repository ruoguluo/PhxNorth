// API client for AI-assisted question structuring (FR-03).
// Talks to the phxnorth-backend behavioral service at /api/v1 (Vite proxies
// /api/v1 -> :8000). Mirrors the auth/fetch pattern used in disc-api.ts.

const QUESTION_BASE = "/api/v1";

async function fetchQuestion<T>(
    endpoint: string,
    body: unknown
): Promise<T> {
    const token = localStorage.getItem("phxnorth_token");
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${QUESTION_BASE}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ detail: "Request failed" }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
}

// ─── Types (mirror the backend Pydantic schemas) ────────────────────

export interface AIUnderstanding {
    country: string;
    category: string;
    subtype: string;
    stage: string;
    primaryGoal: string;
    timeHorizon?: string | null;
}

export interface AssumedGoalDTO {
    institution: string;
    programLevel: string;
    major: string;
    targetIntake: string;
    country: string;
    category: string;
}

export interface StageOptionDTO {
    id: string;
    label: string;
}

export interface ClarificationQuestionDTO {
    id: string;
    question: string;
    type: "text" | "select";
    options?: string[] | null;
}

export interface InterpretResponse {
    understanding: AIUnderstanding;
    assumedGoal: AssumedGoalDTO;
    stageOptions: StageOptionDTO[];
    clarificationQuestions: ClarificationQuestionDTO[];
    ai_generated: boolean;
}

export interface SubQuestionDTO {
    id: string;
    question: string;
    purpose: string;
    depthLevel: "Foundation" | "Application" | "Strategic";
    estimatedTime: number;
}

export interface StructuredQuestionDTO {
    domain: string;
    backgroundContext: string;
    desiredOutcome: string;
    timeHorizon: string;
    successCriteria: string;
}

export interface AgendaResponse {
    subQuestions: SubQuestionDTO[];
    structured: StructuredQuestionDTO;
    ai_generated: boolean;
}

// ─── API ────────────────────────────────────────────────────────────

export const questionAPI = {
    interpret: (
        rawQuestion: string,
        opts: { category?: string; country?: string } = {}
    ) =>
        fetchQuestion<InterpretResponse>("/questions/interpret", {
            raw_question: rawQuestion,
            category: opts.category ?? null,
            country: opts.country ?? null,
        }),

    agenda: (
        rawQuestion: string,
        opts: {
            understanding?: AIUnderstanding;
            stage?: string;
            answers?: Record<string, string>;
        } = {}
    ) =>
        fetchQuestion<AgendaResponse>("/questions/agenda", {
            raw_question: rawQuestion,
            understanding: opts.understanding ?? null,
            stage: opts.stage ?? null,
            answers: opts.answers ?? {},
        }),
};
