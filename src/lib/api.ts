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
    summary?: string;
    functional_expertise?: string[];
    markets_of_interest?: string[];
    career_direction?: string;
    preferred_mentor_geography?: string;
    global_visibility?: string;
    show_current_company?: boolean;
    show_full_timeline?: boolean;
    allow_enterprise_view?: boolean;
    allow_mentor_discovery?: boolean;
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

// ─── Timeline API ───────────────────────────────────────────────────

export interface TimelineEntry {
    id: number;
    user_id: number;
    type: "education" | "career" | "business";
    title: string;
    organization?: string;
    hide_organization: boolean;
    start_date?: string;
    end_date?: string;
    is_current: boolean;
    location?: string;
    industry_l1?: string;
    industry_l2?: string;
    industry_l3?: string;
    description?: string;
    degree_level?: string;
    field_of_study?: string;
    visibility: "public" | "private";
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

export const timelineAPI = {
    list: (type?: string) => {
        const qs = type ? `?type=${type}` : "";
        return fetchAPI<TimelineEntry[]>(`/profile/timeline${qs}`);
    },

    create: (data: Omit<TimelineEntry, "id" | "user_id" | "created_at" | "updated_at">) =>
        fetchAPI<TimelineEntry>("/profile/timeline", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: Partial<Omit<TimelineEntry, "id" | "user_id" | "created_at" | "updated_at">>) =>
        fetchAPI<TimelineEntry>(`/profile/timeline/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    remove: (id: number) =>
        fetch(`${API_BASE}/profile/timeline/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}`,
            },
        }).then((r) => { if (!r.ok) throw new Error("Delete failed"); }),

    reorder: (items: { id: number; sort_order: number }[]) =>
        fetchAPI<TimelineEntry[]>("/profile/timeline/reorder", {
            method: "PUT",
            body: JSON.stringify(items),
        }),
};

// ─── Credentials API ────────────────────────────────────────────────

export interface CredentialEntry {
    id: number;
    user_id: number;
    type: "certification" | "training" | "psychometric";
    name: string;
    issuer?: string;
    date_obtained?: string;
    expiry_date?: string;
    credential_id?: string;
    training_type?: string;
    duration?: string;
    test_type?: string;
    result_summary?: string;
    visibility: "public" | "private";
    created_at?: string;
}

export const credentialAPI = {
    list: (type?: string) => {
        const qs = type ? `?type=${type}` : "";
        return fetchAPI<CredentialEntry[]>(`/profile/credentials${qs}`);
    },

    create: (data: Omit<CredentialEntry, "id" | "user_id" | "created_at">) =>
        fetchAPI<CredentialEntry>("/profile/credentials", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: Partial<Omit<CredentialEntry, "id" | "user_id" | "created_at">>) =>
        fetchAPI<CredentialEntry>(`/profile/credentials/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    remove: (id: number) =>
        fetch(`${API_BASE}/profile/credentials/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}`,
            },
        }).then((r) => { if (!r.ok) throw new Error("Delete failed"); }),
};

// ─── Consulting API ─────────────────────────────────────────────────

export interface ConsultingProject {
    id: number;
    title: string;
    description?: string;
    client_name?: string;
    budget_min?: number;
    budget_max?: number;
    duration_weeks?: number;
    required_skills?: string[];
    industry?: string;
    status: string;
    assigned_mentor_id?: number;
    created_by: number;
    created_at?: string;
    updated_at?: string;
    applications?: ProjectApplication[];
}

export interface ProjectApplication {
    id: number;
    project_id: number;
    mentor_id: number;
    proposal?: string;
    proposed_rate?: number;
    status: string;
    created_at?: string;
}

export const consultingAPI = {
    listProjects: (params?: { status?: string; industry?: string }) => {
        const qs = new URLSearchParams();
        if (params?.status) qs.set("status", params.status);
        if (params?.industry) qs.set("industry", params.industry);
        const suffix = qs.toString() ? `?${qs}` : "";
        return fetchAPI<ConsultingProject[]>(`/consulting/projects${suffix}`);
    },

    getProject: (id: number) =>
        fetchAPI<ConsultingProject>(`/consulting/projects/${id}`),

    createProject: (data: Record<string, unknown>) =>
        fetchAPI<ConsultingProject>("/consulting/projects", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    apply: (projectId: number, data: { proposal?: string; proposed_rate?: number }) =>
        fetchAPI<ProjectApplication>(`/consulting/projects/${projectId}/apply`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    handleApplication: (projectId: number, appId: number, action: "approve" | "reject") =>
        fetchAPI<ProjectApplication>(`/consulting/projects/${projectId}/applications/${appId}`, {
            method: "PUT",
            body: JSON.stringify({ action }),
        }),

    myApplications: () =>
        fetchAPI<ProjectApplication[]>("/consulting/my-applications"),

    completeProject: (id: number) =>
        fetchAPI<ConsultingProject>(`/consulting/projects/${id}/complete`, { method: "PUT" }),
};

// ─── Workshop API ───────────────────────────────────────────────────

export interface WorkshopEntry {
    id: number;
    mentor_id: number;
    title: string;
    description?: string;
    scheduled_at?: string;
    duration_minutes?: number;
    max_participants?: number;
    price?: number;
    status: string;
    tags?: string[];
    registered_count: number;
    created_at?: string;
    updated_at?: string;
    registrations?: { id: number; workshop_id: number; mentee_id: number; status: string; created_at?: string }[];
}

export const workshopAPI = {
    list: (params?: { mine?: boolean; status?: string }) => {
        const qs = new URLSearchParams();
        if (params?.mine) qs.set("mine", "true");
        if (params?.status) qs.set("status", params.status);
        const suffix = qs.toString() ? `?${qs}` : "";
        return fetchAPI<WorkshopEntry[]>(`/workshops${suffix}`);
    },

    get: (id: number) => fetchAPI<WorkshopEntry>(`/workshops/${id}`),

    create: (data: Record<string, unknown>) =>
        fetchAPI<WorkshopEntry>("/workshops", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: Record<string, unknown>) =>
        fetchAPI<WorkshopEntry>(`/workshops/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    remove: (id: number) =>
        fetch(`${API_BASE}/workshops/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Delete failed"); }),

    publish: (id: number) =>
        fetchAPI<WorkshopEntry>(`/workshops/${id}/publish`, { method: "PUT" }),

    complete: (id: number) =>
        fetchAPI<WorkshopEntry>(`/workshops/${id}/complete`, { method: "PUT" }),

    register: (id: number) =>
        fetchAPI<unknown>(`/workshops/${id}/register`, { method: "POST" }),

    cancelRegistration: (id: number) =>
        fetch(`${API_BASE}/workshops/${id}/register`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Cancel failed"); }),
};

// ─── Video API ──────────────────────────────────────────────────────

export interface RoomInfo {
    room_url: string;
    token: string;
    room_name: string;
}

export const videoAPI = {
    // Session video
    createSessionRoom: (sessionId: number) =>
        fetchAPI<RoomInfo>(`/mentorship/sessions/${sessionId}/room`, { method: "POST" }),

    getSessionRoom: (sessionId: number) =>
        fetchAPI<{ room_exists: boolean; room_name?: string; room_url?: string }>(`/mentorship/sessions/${sessionId}/room`),

    endSessionCall: (sessionId: number) =>
        fetch(`${API_BASE}/mentorship/sessions/${sessionId}/room`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Failed to end call"); }),

    getRecording: (sessionId: number) =>
        fetchAPI<{ recording_url: string | null }>(`/mentorship/sessions/${sessionId}/recording`),

    getTranscript: (sessionId: number) =>
        fetchAPI<{ transcript_text: string | null }>(`/mentorship/sessions/${sessionId}/transcript`),

    getSummary: (sessionId: number) =>
        fetchAPI<Record<string, unknown>>(`/mentorship/sessions/${sessionId}/summary`),

    generateSummary: (sessionId: number) =>
        fetchAPI<Record<string, unknown>>(`/mentorship/sessions/${sessionId}/summary/generate`, { method: "POST" }),

    // Workshop video
    createWorkshopRoom: (workshopId: number) =>
        fetchAPI<RoomInfo>(`/workshops/${workshopId}/room`, { method: "POST" }),

    joinWorkshopRoom: (workshopId: number) =>
        fetchAPI<RoomInfo>(`/workshops/${workshopId}/join`, { method: "POST" }),

    endWorkshopCall: (workshopId: number) =>
        fetch(`${API_BASE}/workshops/${workshopId}/room`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Failed to end call"); }),
};

// ─── Stripe API ─────────────────────────────────────────────────────

export interface StripeConnectStatus {
    connected: boolean;
    account_id?: string;
    status?: string;
    payouts_enabled: boolean;
    charges_enabled: boolean;
}

export interface StripePaymentMethod {
    has_card: boolean;
    last4?: string;
    brand?: string;
    exp_month?: number;
    exp_year?: number;
}

export const stripeAPI = {
    getPublishableKey: () =>
        fetchAPI<{ publishable_key: string }>("/billing/stripe/publishable-key"),

    // Mentor Connect
    connect: () =>
        fetchAPI<{ onboarding_url: string; account_id: string }>("/billing/stripe/connect", { method: "POST" }),

    getStatus: () =>
        fetchAPI<StripeConnectStatus>("/billing/stripe/status"),

    getDashboardLink: () =>
        fetchAPI<{ url: string }>("/billing/stripe/dashboard-link", { method: "POST" }),

    // Mentee cards
    createSetupIntent: () =>
        fetchAPI<{ client_secret: string; customer_id: string }>("/billing/stripe/setup-intent", { method: "POST" }),

    savePaymentMethod: (paymentMethodId: string) =>
        fetchAPI<StripePaymentMethod>("/billing/stripe/payment-method", {
            method: "POST",
            body: JSON.stringify({ payment_method_id: paymentMethodId }),
        }),

    getPaymentMethod: () =>
        fetchAPI<StripePaymentMethod>("/billing/stripe/payment-method"),

    removePaymentMethod: () =>
        fetch(`${API_BASE}/billing/stripe/payment-method`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("phxnorth_token")}` },
        }).then((r) => { if (!r.ok) throw new Error("Remove failed"); }),
};

// ─── Mentorship API ─────────────────────────────────────────────────

export interface MentorMatch {
    id: string;
    name: string;
    title: string;
    expertise: string[];
    experience: string;
    matchScore: number;
    matchConfidence: string;
    availability: string;
    responseTime: string;
    sessionsCompleted: number;
    avatarColor: string;
    status: string;
    queueLength?: number | null;
    estimatedWaitTime?: string | null;
    nextAvailability?: string | null;
    mentorshipType?: string | null;
    menteesMarked: number;
    deepDialogues: number;
    reasons?: string[];
}

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

    getRequest: (id: number) =>
        fetchAPI<Record<string, unknown>>(`/mentorship/requests/${id}`),

    createRequest: (data: Record<string, unknown>) =>
        fetchAPI<unknown>("/mentorship/requests", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    match: (intent: {
        category?: string;
        subtype?: string;
        primary_goal?: string;
        stage?: string;
        country?: string;
        keywords?: string[];
        max_budget?: number;
        raw_question?: string;
        limit?: number;
    }) =>
        fetchAPI<MentorMatch[]>("/mentorship/match", {
            method: "POST",
            body: JSON.stringify(intent),
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

// ─── Messages API ───────────────────────────────────────────────────

export interface MessageResponse {
    id: number;
    session_id: number;
    sender_id: number;
    sender_role: 'mentor' | 'mentee';
    sender_name: string | null;
    content: string;
    file_url: string | null;
    file_name: string | null;
    is_read: boolean;
    created_at: string;
}

export const messagesAPI = {
    getHistory: (sessionId: number, limit = 50) =>
        fetchAPI<MessageResponse[]>(`/messages/session/${sessionId}?limit=${limit}`),

    send: (sessionId: number, content: string) =>
        fetchAPI<MessageResponse>(`/messages/session/${sessionId}`, {
            method: "POST",
            body: JSON.stringify({ content }),
        }),

    markRead: (sessionId: number) =>
        fetchAPI<{ status: string; message: string }>(`/messages/session/${sessionId}/read`, {
            method: "PUT",
        }),

    uploadFile: async (sessionId: number, file: File): Promise<MessageResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        const token = localStorage.getItem("phxnorth_token");
        const response = await fetch(`/api/messages/session/${sessionId}/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: "Upload failed" }));
            throw new Error(err.detail || "Upload failed");
        }
        return response.json();
    },

    getUnreadCount: async (sessionId: number): Promise<number> => {
        try {
            const messages = await fetchAPI<MessageResponse[]>(`/messages/session/${sessionId}?limit=100`);
            return messages.filter(m => !m.is_read).length;
        } catch {
            return 0;
        }
    },
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

// ─── Billing API (FR-07) ────────────────────────────────────────────

export interface Payment {
    id: number;
    session_id?: number | null;
    mentee_id: number;
    mentor_id: number;
    amount: number;
    platform_fee: number;
    mentor_earnings: number;
    currency: string;
    status: string;
    payout_id?: number | null;
    created_at?: string;
}

export interface Payout {
    id: number;
    mentor_id: number;
    amount: number;
    currency: string;
    status: string;
    period_start?: string | null;
    period_end?: string | null;
    created_at?: string;
}

export interface BillingSummary {
    currency: string;
    // mentee
    total_spent?: number;
    captured_count?: number;
    // mentor
    total_earnings?: number;
    pending_payout?: number;
    paid_out?: number;
    // admin
    gmv?: number;
    fees_collected?: number;
    mentor_earnings?: number;
    payment_count?: number;
    platform_fee_pct?: number;
}

export interface PayoutRunResult {
    payouts_created: number;
    total_disbursed: number;
    payouts: Payout[];
}

export const billingAPI = {
    listPayments: () => fetchAPI<Payment[]>("/billing/payments"),
    getPayment: (id: number) => fetchAPI<Payment>(`/billing/payments/${id}`),
    summary: () => fetchAPI<BillingSummary>("/billing/summary"),
    listPayouts: () => fetchAPI<Payout[]>("/billing/payouts"),
    runPayouts: () =>
        fetchAPI<PayoutRunResult>("/billing/payouts/run", { method: "POST" }),
};

// ─── Conversations API (FR-05) ──────────────────────────────────────

export interface Conversation {
    id: number;
    counterparty_id: number;
    counterparty_name: string | null;
    counterparty_role: 'mentor' | 'mentee';
    last_message: string | null;
    last_message_at: string | null;
    unread_count: number;
}

export const conversationsAPI = {
    list: () => fetchAPI<Conversation[]>("/conversations"),

    get: (id: number) => fetchAPI<Conversation>(`/conversations/${id}`),

    getMessages: (id: number, opts: { q?: string; limit?: number } = {}) => {
        const qs = new URLSearchParams();
        if (opts.q) qs.set("q", opts.q);
        if (opts.limit) qs.set("limit", String(opts.limit));
        const suffix = qs.toString() ? `?${qs}` : "";
        return fetchAPI<MessageResponse[]>(`/conversations/${id}/messages${suffix}`);
    },

    markRead: (id: number) =>
        fetchAPI<{ status: string }>(`/conversations/${id}/read`, { method: "PUT" }),

    send: (id: number, content: string) =>
        fetchAPI<MessageResponse>(`/conversations/${id}/messages`, {
            method: "POST",
            body: JSON.stringify({ content }),
        }),
};

export { fetchAPI };
