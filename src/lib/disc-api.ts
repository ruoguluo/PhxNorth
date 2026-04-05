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

// ─── User ID Resolution ─────────────────────────────────────────────

/** Cached DISC backend user ID (UUID). Cleared on logout. */
let _cachedUserId: string | null = null;

/**
 * Resolve "me" to the actual DISC backend UUID by calling /api/v1/users/me.
 * Caches the result so subsequent calls are instant.
 */
async function resolveUserId(userId: string): Promise<string> {
    if (userId !== "me") return userId;

    if (_cachedUserId) return _cachedUserId;

    const me = await fetchDISC<{ id: string; email: string }>("/users/me");
    _cachedUserId = me.id;
    return _cachedUserId;
}

/** Clear the cached user ID (call on logout). */
export function clearDiscUserCache(): void {
    _cachedUserId = null;
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

export interface RiskAssessmentItem {
    category: string;
    score: number;
    severity: string;
    description: string;
}

export interface RiskAssessment {
    user_id: string;
    computed_at: string;
    overall_risk_tier: string;
    assessments: RiskAssessmentItem[];
    active_flags: RiskFlag[];
    // Aliases for backward compat in components
    overall_risk?: string;
    flags?: RiskFlag[];
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

export interface DimensionGap {
    dimension_a: string;
    dimension_b: string;
    gap: number;
    interpretation: string;
}

export interface ContradictionResponse {
    user_id: string;
    contradiction_score: number;
    severity_tier: string;
    threshold_exceeded: boolean;
    dimension_gaps: DimensionGap[];
    flagged_dimensions: string[];
    contradiction_type: string | null;
}

export interface BehavioralShiftResponse {
    user_id: string;
    shift_detected: boolean;
    magnitude: number;
    shift_type: string | null;
    shifted_dimensions: string[];
    interpretation: string | null;
}

// ─── Career Types ───────────────────────────────────────────────────

export interface CareerAnalytics {
    total_experience_months: number;
    avg_tenure_months: number;
    distinct_companies: number;
    distinct_roles: number;
}

export interface CareerEntry {
    title: string;
    company: string;
    start_date: string | null;
    end_date: string | null;
    duration_months: number | null;
}

export interface CareerTurningPoint {
    date: string | null;
    description: string;
    type: string;
}

export interface CareerProfile {
    user_id: string;
    analytics: CareerAnalytics;
    job_entries: CareerEntry[];
    turning_points: CareerTurningPoint[];
}

export interface PreferenceIndexValue {
    value: number;
    label: string;
    interpretation: string;
}

export interface PreferenceIndexes {
    stability_vs_growth: PreferenceIndexValue;
    conservative_vs_aggressive_risk: PreferenceIndexValue;
    control_vs_collaboration: PreferenceIndexValue;
    short_term_vs_long_term: PreferenceIndexValue;
    consistency_score: PreferenceIndexValue;
}

export interface PreferencesResponse {
    user_id: string;
    computed_at: string;
    indexes: PreferenceIndexes;
}

// ─── CV API ─────────────────────────────────────────────────────────

export const discCvAPI = {
    upload: async (file: File, userId = "me") => {
        const uid = await resolveUserId(userId);
        const form = new FormData();
        form.append("file", file);
        return fetchDISC<CvUploadResponse>(`/users/${uid}/cv/upload`, {
            method: "POST",
            body: form,
            multipart: true,
        });
    },

    pasteText: async (rawText: string, userId = "me") => {
        const uid = await resolveUserId(userId);
        return fetchDISC<CvUploadResponse>(`/users/${uid}/cv/text`, {
            method: "POST",
            body: JSON.stringify({ raw_text: rawText, source: "paste" } satisfies CvTextPayload),
        });
    },

    getStatus: async (jobId: string, userId = "me") => {
        const uid = await resolveUserId(userId);
        return fetchDISC<CvStatusResponse>(`/users/${uid}/cv/status/${jobId}`);
    },
};

// ─── DISC Profile API ───────────────────────────────────────────────

export const discProfileAPI = {
    get: async (userId = "me", window?: string) => {
        const uid = await resolveUserId(userId);
        const qs = window ? `?window=${encodeURIComponent(window)}` : "";
        return fetchDISC<DISCProfile>(`/users/${uid}/disc-profile${qs}`);
    },

    history: async (userId = "me", params?: { from?: string; to?: string }) => {
        const uid = await resolveUserId(userId);
        const query = new URLSearchParams();
        if (params?.from) query.set("from", params.from);
        if (params?.to) query.set("to", params.to);
        const qs = query.toString();
        return fetchDISC<DISCProfileHistoryResponse>(
            `/users/${uid}/disc-profile/history${qs ? `?${qs}` : ""}`
        );
    },
};

// ─── Risk API ───────────────────────────────────────────────────────

export const discRiskAPI = {
    get: async (userId = "me") => {
        const uid = await resolveUserId(userId);
        const data = await fetchDISC<RiskAssessment>(`/users/${uid}/risk`);
        // Normalize field names for frontend compat
        data.overall_risk = data.overall_risk_tier ?? data.overall_risk;
        data.flags = data.active_flags ?? data.flags ?? [];
        return data;
    },

    history: async (userId = "me", category?: string) => {
        const uid = await resolveUserId(userId);
        const qs = category ? `?category=${encodeURIComponent(category)}` : "";
        return fetchDISC<RiskHistoryResponse>(`/users/${uid}/risk/history${qs}`);
    },

    contradictions: async (userId = "me") => {
        const uid = await resolveUserId(userId);
        return fetchDISC<ContradictionResponse>(`/users/${uid}/contradiction`);
    },

    behavioralShift: async (userId = "me") => {
        const uid = await resolveUserId(userId);
        return fetchDISC<BehavioralShiftResponse>(`/users/${uid}/behavioral-shift`);
    },
};

// ─── Career API ─────────────────────────────────────────────────────

export const discCareerAPI = {
    get: async (userId = "me") => {
        const uid = await resolveUserId(userId);
        return fetchDISC<CareerProfile>(`/users/${uid}/career`);
    },

    preferences: async (userId = "me") => {
        const uid = await resolveUserId(userId);
        return fetchDISC<PreferencesResponse>(`/users/${uid}/preferences`);
    },
};

// ─── Admin API ──────────────────────────────────────────────────────

export interface DISCUser {
    id: string;
    email: string;
    is_active: boolean;
    created_at: string | null;
}

export const discAdminAPI = {
    listUsers: () =>
        fetchDISC<DISCUser[]>("/admin/users"),

    resetUserData: async (userId: string) => {
        // Clear cached ID since user record will be deleted
        clearDiscUserCache();
        return fetchDISC<{ status: string; message: string; user_id: string; email: string }>(
            `/admin/users/${userId}/disc-data`,
            { method: "DELETE" }
        );
    },
};

export { fetchDISC };
