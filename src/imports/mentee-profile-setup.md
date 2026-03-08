Design / build the Mentee onboarding “Profile Setup” experience (first screen after selecting role = Mentee).

Goal:
This page is NOT mentorship booking yet. It is the “Build / Upload Profile” entry point with a left-side navigation that stays visible so users can update anytime. Must support: Upload local file, Import LinkedIn, or Fill via PhxNorth form. Must include timeline (education/career/business), industry multi-level taxonomy, AI auto-fill + user confirmation checkbox before proceeding, modular sections (certifications, training, psychometric tests) addable via +, smart “small menu” suggestions + fallback to full menu, and granular privacy controls (public / private) including hiding current company name while keeping title mandatory, and requiring industry classification if company hidden.

Layout:
- Use a 2-column app layout:
  Left: fixed sidebar (Profile navigation + completeness + save status)
  Right: main content (Profile Builder wizard with steps)

LEFT SIDEBAR (always visible):
1) Header: “Profile” + completeness meter (e.g., 35% complete)
2) Quick actions:
   - “Upload / Import” (primary)
   - “Edit Sections”
   - “Privacy Controls”
3) Sections list (clickable):
   - Overview
   - Education Timeline
   - Career Timeline
   - Business / Projects Timeline
   - Certifications (+ add)
   - Professional Training (+ add)
   - Psychometric Tests (+ add)
   - Skills & Expertise
   - Preferences (markets, industries, availability)
4) Each section shows status: Not started / Draft / Verified
5) A persistent “Save Draft” + “Continue” button area (Continue disabled until required confirmations done)

RIGHT MAIN CONTENT: Step 1 = “Upload / Import / Fill”
Top header:
- Title: “Build your 5D Profile”
- Subtitle (short): “Import fast, then confirm. You control what’s public.”

Three large method cards (choose one; can switch later):
A) Upload Local
   - Accept: PDF resume, DOCX, TXT
   - Microcopy: “We’ll extract timelines and classify industries automatically.”
B) Import LinkedIn
   - Button: “Connect LinkedIn”
   - Microcopy: “We import positions, education, skills. You approve before saving.”
C) Fill with PhxNorth Form
   - Button: “Start guided form”
   - Microcopy: “Structured inputs = stronger matching + enterprise opportunities.”

After any method, show: “AI Parsed Draft (Review & Confirm)” panel.

AI AUTO-FILL + USER CONFIRMATION (mandatory gate):
- Show a clear bordered “AI-Suggested Data” box for every parsed field.
- Each field has:
  - Suggested value (editable)
  - Confidence indicator (High/Med/Low)
  - Checkbox: “Confirm this is correct”
  - Option: “Edit” / “Remove”
- Global confirmation rule:
  - User must confirm required fields before proceeding:
    Required: Current title, primary industry (level-1 + level-2), country/region, at least 1 timeline entry (education or career)
  - Continue button stays disabled until required confirmations checked.

TIMELINE STRUCTURE (education / career / business):
Design each as a vertical timeline editor with “+ Add entry” and reorder.
Each entry contains:
- Date range (start/end, “Present”)
- Title / Degree / Project role
- Organization (School / Company / Client) with privacy toggle:
  - “Hide organisation name” option (allowed)
  - If hidden for a career entry, enforce:
    - Job title mandatory
    - Industry classification mandatory (level-1 + level-2)
- Location (country/city)
- Industry classification (for career + business):
  - Cascading dropdown: Level 1 (broad sector) → Level 2 (sub-sector) → optional Level 3 (specialism)
  - Default shows “AI recommended choices” (small menu, 6–10 options max)
  - Link: “See full taxonomy” opens full searchable list
  - Also allow “Type to add” (free text). When user types, AI suggests the closest taxonomy mapping and asks user to confirm.

Industry taxonomy design (must be multi-level):
- Level 1 examples (broad):
  Financial Services, Technology, Healthcare & Life Sciences, Industrial & Manufacturing, Energy & Utilities, Consumer & Retail, Media & Telecom, Real Estate & Construction, Transportation & Logistics, Professional Services, Public Sector & Education.
- Level 2 examples (sub-sectors) — show relevant ones based on Level 1 selection:
  Financial Services → Asset Management, Investment Banking, Wealth Management, FinTech, Insurance
  Technology → SaaS, AI/ML, Cybersecurity, Data Infrastructure, Hardware
  Healthcare → MedTech, Biotech, Pharma, Digital Health, Providers
  Energy → Renewables, Oil & Gas, Power Grid, Energy Trading
  Real Estate & Construction → Construction, Architecture, Infrastructure, Property Development
(Keep taxonomy extensible; do not hardcode all. UI must support adding more.)

MODULAR “ADD SECTION” MECHANISM:
In the sidebar and in main content, include a “+ Add Section” button.
When clicked:
- Modal: “Add to your profile”
- Options:
  Certifications
  Professional Training
  Psychometric Tests
  Custom (name your section)
For each new section:
- Step 1: choose type
- Step 2: choose specific item name:
   - Show AI-recommended shortlist based on user’s domain/industry (small menu)
   - If not found: “Search full list” + “Add by typing”
- When user types an unknown certificate/test:
   - AI proposes category + relevant domain tags
   - User confirms mapping
Examples:
Certifications: CFA, ACCA, PMP, AWS, CISSP, FRM…
Psychometric tests: DISC, MBTI, Big Five, Hogan, StrengthsFinder…
(These are examples; UI must be generic and extensible.)

PRIVACY CONTROLS (granular):
Add a “Visibility” control on:
- Each section (Public / Private / Custom)
- Each entry (Public / Private)
- Key fields within entry (Company name, School name, dates, etc.)
Rules:
- Title is always required (cannot be hidden).
- Company name can be hidden, but then industry must be selected.
- Provide a short reassurance text:
  “You control visibility. Mentors and enterprises only see what you allow.”

PROGRESSION:
At bottom of the page:
- Primary CTA: “Continue to 5D Analysis” (disabled until required confirmations complete)
- Secondary: “Save draft”
- Tertiary: “Skip for now” (allowed, but shows warning: “Matching quality will be limited until profile is completed.”)

Visual style:
- Keep PhxNorth enterprise clean UI.
- Sidebar white, main content white, blue accents.
- “AI suggested” boxes have subtle highlight and clear “Confirm” checkboxes.
- Timelines and section cards use consistent rounded corners and spacing.

Output:
Update the current mentee flow so that after choosing Mentee role, the first page is this Profile Setup page (not dashboard).