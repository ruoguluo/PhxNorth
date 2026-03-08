Redesign the post–Create Account landing page into a “Registered User (Pre-Role)” page — NOT a dashboard yet.

GOAL
The user just created an account but has NOT selected any role. The page must:
- Explain why role selection matters (in 1–2 lines)
- Make role selection the most prominent action
- Only show 2 content areas before role selection:
  (1) Instant Mentorship (online mentor grid)
  (2) Workshops (open / upcoming / pre-announced)

PAGE NAME
“Welcome to PhxNorth” (Pre-Role)

TOP HERO (VERY PROMINENT)
- Title: “Choose your role to unlock your dashboard.”
- Subtitle (short, direct): “Your role tells us what you’re here to do — so we can tailor mentors, projects, and tools to you.”
- Primary CTA: “Choose My Role”
- Secondary CTA (smaller): “I’ll do this later” (but still keep role banner sticky)
- Add a progress indicator: Step 1 ✅ Account created  → Step 2 ⬜ Choose role  → Step 3 ⬜ Activate 5D profile

ROLE SELECTION MODULE (CENTERPIECE)
Design as a large card section with 3–5 role tiles (multi-select allowed if that’s your product direction; otherwise single-select with “You can add more later”).
Each tile includes: role name + 1 sentence “why it matters” + “Select” toggle.

Roles (example copy — concise):
1) Mentee (Growth)
   “Get matched in 5D and build a guided mentorship pathway.”
2) Mentor
   “Offer instant/scheduled mentorship and build your advisory reputation.”
3) Talent Mobility (Referral System)
   “Join structured talent campaigns — refer, match, and earn credibility.”
4) Commercial Advisory
   “Work on enterprise-grade consulting projects with governed delivery.”
5) Workshop Speaker (optional)
   “Host workshops and grow your authority with structured outcomes.”

Microcopy under tiles:
- “Not sure? Start with Mentee — you can change roles anytime.”
- “Role selection takes < 30 seconds.”

After user selects role(s) and clicks Continue:
- Confirmation toast: “Role saved. Building your dashboard…”
- Then route to the role-specific dashboard.

BEFORE ROLE IS CHOSEN — ONLY SHOW THESE 2 SECTIONS

SECTION 1: INSTANT MENTORSHIP — ONLINE TALENT GRID (PRIMARY CONTENT)
Header row:
- Title: “Instant Mentorship: Mentors Available Now”
- Filter chips (based on registration data):
  - Country (default = user current country)
  - Interested Markets
  - Industry (current)
  - Interested Industry
  - Availability: Online now / Instant-enabled / All
- Right action: “More mentors →”

Grid:
- 4 columns × 4 rows = 16 mentor cards shown
- Each mentor card shows:
  - Avatar + First name + Country flag/name
  - Title (short) + Industry tag
  - Status pill:
    - “LIVE” (green) if currently on a call
    - “Online” (green) if available now
    - “Instant-enabled (Offline)” (gray) if offline but offers instant mentorship
  - CTA:
    - If Online: “Start instant session”
    - If LIVE: “Join queue” or “Notify me”
    - If Instant-enabled (Offline): “Request instant” (or “Schedule” if you want safer UX)
- Add a small note: “Results are personalised using your registration info — refine anytime in Settings.”

SECTION 2: WORKSHOPS (SECONDARY CONTENT)
Header row:
- Title: “Workshops”
- Tabs: “Open for Registration” | “Upcoming” | “Announced (Not Open Yet)”
- Right action: “View all workshops →”

Workshop cards (list layout, 2–3 visible per tab):
Each card includes:
- Workshop title
- Speaker(s) + short credential line
- Date & time + Timezone
- Seats remaining (e.g., “8 seats left”)
- Registration deadline + countdown (e.g., “Closes in 2d 4h”)
- CTA:
  - Open tab: “View & Register”
  - Upcoming tab: “View details”
  - Announced tab: “Notify me when registration opens” + show “Opens on Mar 12”

Workshop detail page (on click) MUST include:
- Hero: title + date/time + seats + deadline + CTA
- Leaflet preview/download section
- Speaker profile block (bio + expertise tags)
- Agenda section (timeline bullets)
- What you’ll get (3 bullets)
- Requirements / Policies:
  - NDA (if applicable), recording notice, refund policy, code of conduct
- “Who it’s for” (3 bullets)
- “Register” CTA sticky on desktop (right rail)

LAYOUT RULES
- Remove all “progress overview” widgets (active projects, enrolled courses, compliance score, etc.) — those belong only AFTER role selection.
- Keep page clean, enterprise, not playful.
- Role selection module stays above the fold (or at least visible without scrolling on desktop).
- Add a sticky mini banner at bottom when user scrolls:
  “Choose your role to unlock your dashboard” + button “Choose Role”.

EMPTY STATES
- If no mentors match: show “No instant mentors match your filters right now — widen markets or view all.”
- If no workshops open: show “No workshops currently open — see upcoming or get notified.”

VISUAL STYLE
Match your current brand:
- White background sections + subtle border
- Blue accents consistent with homepage
- Status colors: Live/Online green; Offline gray; Attention (deadline) orange
- Rounded cards, soft shadow, high contrast headings

DELIVERABLE
Update the page layout and copy exactly per above, replacing the current “Welcome back, John!” dashboard UI.