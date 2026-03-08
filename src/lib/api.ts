const API_BASE = "/api";

/**
 * Generic fetch wrapper that adds JWT authorization header.
 */
async function fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem("phxnorth_token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
}

// ─── Auth API ───────────────────────────────────────────────────────

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface UserProfile {
    id: number;
    email: string;
    username: string;
    full_name: string;
    role: string;
    is_active: boolean;
    is_online: boolean;
    status?: string;
    degree_level?: string;
    field_of_study?: string;
    years_experience?: string;
    current_country?: string;
    interested_countries?: string[];
    industry?: string;
    sector?: string;
    sub_sector?: string;
    interested_industries?: string[];
    keep_name_private: boolean;
    bio?: string;
    avatar_url?: string;
    hourly_rate?: number;
    rating: number;
    total_sessions: number;
    monthly_income: number;
    specializations?: string[];
    created_at?: string;
}

export const authAPI = {
    login: (email: string, password: string) =>
        fetchAPI<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    register: (data: Record<string, unknown>) =>
        fetchAPI<LoginResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getMe: () => fetchAPI<UserProfile>("/auth/me"),
};

// ─── Profile API ────────────────────────────────────────────────────

export const profileAPI = {
    get: () => fetchAPI<UserProfile>("/profile"),

    update: (data: Record<string, unknown>) =>
        fetchAPI<UserProfile>("/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    getPublic: (username: string) =>
        fetchAPI<UserProfile>(`/profile/${username}`),

    listMentors: (params?: { online_only?: boolean; industry?: string; country?: string }) => {
        const query = new URLSearchParams();
        if (params?.online_only) query.set("online_only", "true");
        if (params?.industry) query.set("industry", params.industry);
        if (params?.country) query.set("country", params.country);
        const qs = query.toString();
        return fetchAPI<UserProfile[]>(`/profile/mentors${qs ? `?${qs}` : ""}`);
    },

    toggleOnlineStatus: () =>
        fetchAPI<{ is_online: boolean }>("/profile/online-status", { method: "PUT" }),
};

// ─── Mentorship API ─────────────────────────────────────────────────

export const mentorshipAPI = {
    getAvailability: () => fetchAPI<unknown[]>("/mentorship/availability"),

    updateAvailability: (slots: unknown[]) =>
        fetchAPI<unknown[]>("/mentorship/availability", {
            method: "PUT",
            body: JSON.stringify({ slots }),
        }),

    listRequests: (role = "mentor", statusFilter?: string) => {
        const query = new URLSearchParams({ role });
        if (statusFilter) query.set("status_filter", statusFilter);
        return fetchAPI<unknown[]>(`/mentorship/requests?${query}`);
    },

    createRequest: (data: Record<string, unknown>) =>
        fetchAPI<unknown>("/mentorship/requests", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    respondToRequest: (id: number, action: "accept" | "decline") =>
        fetchAPI<unknown>(`/mentorship/requests/${id}/respond`, {
            method: "PUT",
            body: JSON.stringify({ action }),
        }),

    listSessions: (statusFilter?: string) => {
        const query = statusFilter ? `?status_filter=${statusFilter}` : "";
        return fetchAPI<unknown[]>(`/mentorship/sessions${query}`);
    },

    getSession: (id: number) => fetchAPI<unknown>(`/mentorship/sessions/${id}`),

    completeSession: (id: number, data: Record<string, unknown>) =>
        fetchAPI<unknown>(`/mentorship/sessions/${id}/complete`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    getQueue: () => fetchAPI<unknown[]>("/mentorship/queue"),

    getCalendar: (month?: number, year?: number) => {
        const query = new URLSearchParams();
        if (month) query.set("month", String(month));
        if (year) query.set("year", String(year));
        const qs = query.toString();
        return fetchAPI<unknown[]>(`/mentorship/calendar${qs ? `?${qs}` : ""}`);
    },

    getStats: () => fetchAPI<unknown>("/mentorship/stats"),
};

// ─── Admin API ──────────────────────────────────────────────────────

export const adminAPI = {
    getStats: () => fetchAPI<unknown>("/admin/stats"),

    listUsers: (role?: string, skip = 0, limit = 50) => {
        const query = new URLSearchParams({ skip: String(skip), limit: String(limit) });
        if (role) query.set("role", role);
        return fetchAPI<unknown[]>(`/admin/users?${query}`);
    },

    getUser: (id: number) => fetchAPI<unknown>(`/admin/users/${id}`),

    updateUser: (id: number, data: Record<string, unknown>) =>
        fetchAPI<unknown>(`/admin/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
};

export { fetchAPI };
