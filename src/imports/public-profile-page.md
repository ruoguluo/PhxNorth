Enhance the homepage "GLOBAL TALENT IS JOINING NOW" horizontal scrolling cards.

Goal:
Each card is clickable and opens a Public Profile page for that person.
Maintain current visual style, typography, and brand system.

A) HOMEPAGE INTERACTION
1) Make every person card in the horizontal carousel clickable.
2) On click: navigate to a new page named "Public Profile" (dynamic per person).
3) Add hover state for cards: subtle elevation + pointer cursor (no heavy redesign).
4) Keep the existing country dropdown (e.g., United Kingdom) unchanged.

B) PUBLIC PROFILE PAGE (NEW)
Create a clean, premium public profile page showing:
- Role(s)
- Services offered (multi-select)
- 5D Profile summary
- Mentor tags (if mentor)
- Workshops section (if workshop speaker)
- Courses section (if mentorship courses)
- Business consulting section (if business consultant)

Layout Structure:

1) Header (Top)
- Avatar (placeholder)
- Full name
- Country
- Primary Title (e.g., "VP Operations • E-commerce")
- Primary Role chips (e.g., Mentor / Mentee / Workshop Speaker / Business Consultant)
- Optional: "Verified" badge placeholder (if needed later)

2) Services Offered (Dynamic Chips)
Title: "Services Offered"
Show chips ONLY for selected services:
- Instant Mentorship
- Scheduled Mentorship
- Workshop Speaker
- Mentorship Courses
- Business Consultant

Each chip shows:
- Service name
- Status (Available / Limited / Offline) with small indicator

3) 5D Profile Snapshot (Always Visible)
Title: "5D Profile Snapshot"
Display 5 compact cards or a single grouped card with 5 rows:
- Hard Skills (top 3)
- Soft Skills (top 3)
- Decision Logic (1-line summary)
- Risk Calibration (indicator: conservative / balanced / bold)
- Network Capital (indicator + 1-line summary)

Add a small "View Full Profile" link (no full CV on this page).

4) Mentor Tags (Only if user has Mentor role)
Title: "Mentor Tags"
Show skill/industry tags (chips), e.g.:
Product Strategy, FinTech, Leadership, Fundraising, etc.

5) Workshop Section (Only if Workshop Speaker is selected)
Title: "Workshops"
Sub-tabs or grouped blocks:
- Upcoming Workshops
- Ongoing Workshops
- Past Workshops

Each workshop card includes:
- Workshop title
- Date/time
- Topic tags
- Remaining seats (e.g., "8 seats left")
- CTA button: "View Workshop" or "Request Seat"

6) Courses Section (Only if Mentorship Courses is selected)
Title: "Courses"
Show course list cards including:
- Course name
- Enrollment status (Open / Closed)
- User’s earliest available start date OR enrollment date field
- CTA: "View Course" / "Enroll"

Fields to show per course:
- Course Title
- Enrolled date (if enrolled)
- Next cohort date (if cohort-based)

7) Business Consulting Section (Only if Business Consultant is selected)
Title: "Business Consulting"
Show:
- Consulting focus areas (chips)
- Typical engagement types (e.g., strategy review, security review, product architecture)
- CTA: "Request Consultation"

8) Minimal “About” Section (No full CV)
Title: "About"
Short paragraph (3–5 lines)
Optional bullets: Industries / Languages / Timezone availability

C) IMPORTANT RULES
- This page is NOT a detailed CV/resume page.
- Do not show full work history details; keep it as a structured overview.
- Sections must be conditional: only visible if relevant services/roles exist.
- Keep design consistent with existing PhxNorth UI: minimal, premium, structured.
- Use the same spacing, border radius, and card style as the current dashboard cards.

D) NAVIGATION
Add a back navigation:
"← Back to Live Join"