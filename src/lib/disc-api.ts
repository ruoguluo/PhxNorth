const DISC_BASE = "/api/v1";

// ─── Fetch Wrapper ──────────────────────────────────────────────────

interface FetchDISCOptions extends RequestInit {
    /** When true, skips setting Content-Type (for multipart/form-data). */
    multipart?: boolean;
}

async function fetchDISC<T>(
    endpoint: string,
    options: FetchDISCOptions = {}
): Promise<T> {
    const { multipart, ...fetchOptions } = options;
    const token = localStorage.getItem("phxnorth_token");

    const headers: Record<string, string> = {
        ...(multipart ? {} : { "Content-Type": "application/json" }),
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${DISC_BASE}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
}

// ─── CV Types ───────────────────────────────────────────────────────

export interface CvUploadResponse {
    job_id: string;
    status: "queued" | "processing";
    message: string;
}

export interface CvTextPayload {
    raw_text: string;
    source: "paste";
}

export type CvParseStatus =
    | "queued"
    | "processing"
    | "completed"
    | "failed";

export interface CvStatusResponse {
    job_id: string;
    status: CvParseStatus;
    progress?: number;
    result?: {
        sections_parsed: number;
        word_count: number;
    };
    error?: string;
}

// ─── DISC Profile Types ─────────────────────────────────────────────

export interface DISCScores {
    D: number;
    I: number;
    S: number;
    C: number;
}

export interface DISCProfile {
    user_id: string;
    primary_type: "D" | "I" | "S" | "C";
    secondary_type?: "D" | "I" | "S" | "C";
    scores: DISCScores;
    confidence: number;
    window: string;
    computed_at: string;
    summary: string;
    traits: string[];
}

export interface DISCProfileHistoryEntry {
    scores: DISCScores;
    primary_type: "D" | "I" | "S" | "C";
    confidence: number;
    computed_at: string;
}

export interface DISCProfileHistoryResponse {
    user_id: string;
    entries: DISCProfileHistoryEntry[];
    from: string;
    to: string;
}

// ─── Risk Types ─────────────────────────────────────────────────────

export interface RiskFlag {
    category: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    evidence: string[];
    detected_at: string;
}

export interface RiskAssessment {
    user_id: string;
    overall_risk: "low" | "medium" | "high" | "critical";
    flags: RiskFlag[];
    assessed_at: string;
}

export interface RiskHistoryEntry {
    category: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    detected_at: string;
}

export interface RiskHistoryResponse {
    user_id: string;
    category?: string;
    entries: RiskHistoryEntry[];
}

export interface Contradiction {
    field: string;
    claim_a: string;
    claim_b: string;
    source_a: string;
    source_b: string;
    severity: "low" | "medium" | "high";
    detected_at: string;
}

export interface ContradictionResponse {
    user_id: string;
    contradictions: Contradiction[];
    assessed_at: string;
}

export interface BehavioralShiftEntry {
    dimension: string;
    previous_value: number;
    current_value: number;
    delta: number;
    direction: "increase" | "decrease";
    significance: "minor" | "notable" | "major";
}

export interface BehavioralShiftResponse {
    user_id: string;
    shifts: BehavioralShiftEntry[];
    period: string;
    assessed_at: string;
}

// ─── Career Types ───────────────────────────────────────────────────

export interface CareerAnalytics {
    tenure_avg_months: number;
    progression_rate: string;
    industry_consistency: number;
    role_diversity: number;
}

export interface CareerEntry {
    title: string;
    company: string;
    industry?: string;
    start_date: string;
    end_date?: string;
    duration_months: number;
}

export interface CareerProfile {
    user_id: string;
    entries: CareerEntry[];
    analytics: CareerAnalytics;
    updated_at: string;
}

export interface PreferenceIndex {
    dimension: string;
    score: number;
    label: string;
    evidence_count: number;
}

export interface PreferencesResponse {
    user_id: string;
    indexes: PreferenceIndex[];
    computed_at: string;
}

// ─── CV API ─────────────────────────────────────────────────────────

export const discCvAPI = {
    upload: (file: File, userId = "me") => {
        const form = new FormData();
        form.append("file", file);
        return fetchDISC<CvUploadResponse>(`/users/${userId}/cv/upload`, {
            method: "POST",
            body: form,
            multipart: true,
        });
    },

    pasteText: (rawText: string, userId = "me") =>
        fetchDISC<CvUploadResponse>(`/users/${userId}/cv/text`, {
            method: "POST",
            body: JSON.stringify({ raw_text: rawText, source: "paste" } satisfies CvTextPayload),
        }),

    getStatus: (jobId: string, userId = "me") =>
        fetchDISC<CvStatusResponse>(`/users/${userId}/cv/status/${jobId}`),
};

// ─── DISC Profile API ───────────────────────────────────────────────

export const discProfileAPI = {
    get: (userId = "me", window?: string) => {
        const qs = window ? `?window=${encodeURIComponent(window)}` : "";
        return fetchDISC<DISCProfile>(`/users/${userId}/disc-profile${qs}`);
    },

    history: (userId = "me", params?: { from?: string; to?: string }) => {
        const query = new URLSearchParams();
        if (params?.from) query.set("from", params.from);
        if (params?.to) query.set("to", params.to);
        const qs = query.toString();
        return fetchDISC<DISCProfileHistoryResponse>(
            `/users/${userId}/disc-profile/history${qs ? `?${qs}` : ""}`
        );
    },
};

// ─── Risk API ───────────────────────────────────────────────────────

export const discRiskAPI = {
    get: (userId = "me") =>
        fetchDISC<RiskAssessment>(`/users/${userId}/risk`),

    history: (userId = "me", category?: string) => {
        const qs = category ? `?category=${encodeURIComponent(category)}` : "";
        return fetchDISC<RiskHistoryResponse>(`/users/${userId}/risk/history${qs}`);
    },

    contradictions: (userId = "me") =>
        fetchDISC<ContradictionResponse>(`/users/${userId}/contradiction`),

    behavioralShift: (userId = "me") =>
        fetchDISC<BehavioralShiftResponse>(`/users/${userId}/behavioral-shift`),
};

// ─── Career API ─────────────────────────────────────────────────────

export const discCareerAPI = {
    get: (userId = "me") =>
        fetchDISC<CareerProfile>(`/users/${userId}/career`),

    preferences: (userId = "me") =>
        fetchDISC<PreferencesResponse>(`/users/${userId}/preferences`),
};

export { fetchDISC };
