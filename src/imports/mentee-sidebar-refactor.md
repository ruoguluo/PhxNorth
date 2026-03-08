Refactor the Mentee dashboard left sidebar to be role-driven and simplified.

GOAL:
• The sidebar should only show tools relevant to the user's selected role(s)
• In the Mentee dashboard, keep ONLY "Talent Referral / Referrals" (recommended talents)
• Remove business consultation / advisory project items from the Mentee sidebar
• The user's selected roles should appear at the very top for quick switching

--------------------------------------------------
SIDEBAR STRUCTURE (MENTEE DASHBOARD)
--------------------------------------------------

1) TOP — ROLE SWITCHER (Dynamic)
Place a compact role switcher at the top of the sidebar.

Rule:
• Only display roles the user has selected/activated
• The first (topmost) role shown should be the current active role
• Roles not selected must NOT appear

Example:
Roles (chips or compact tabs):
[Mentee] [Mentor] [Business Consultant]
(Do NOT show Workshop Speaker)

Behavior:
• Clicking a role switches to that role’s dashboard route
• Active role is highlighted

--------------------------------------------------
2) MENTEE TOOLS (Simplified)
Under the role switcher, show only Mentee-relevant navigation items.

KEEP:
• Dashboard / Overview
• My Profile
• Scheduled Mentorship (if applicable)
• Instant Mentorship (if applicable)

ENTERPRISE / BUSINESS MODULE:
In the Mentee sidebar, keep ONLY the Referral feature.

Rename section:
Talent Referral
or
My Referrals

Sub-items:
• Ongoing Referrals (show count badge if >0)
• Completed Referrals

REMOVE from Mentee sidebar:
• Enterprise Engagement (as a broad category label)
• My Advisory Projects
• Ongoing Projects / Completed Projects
• Any Business Consultation / Advisory Projects entries

--------------------------------------------------
BADGES & STYLE
--------------------------------------------------

• Use small rounded badge for counts (e.g., 2)
• Do NOT use large circular bubbles
• Keep clean SaaS typography and spacing
• Sub-items slightly indented under section header

--------------------------------------------------
ROUTING / NAV LOGIC (if applicable)
--------------------------------------------------

Mentee referral routes (example):
/app/mentee/referrals/ongoing
/app/mentee/referrals/completed

Do not show enterprise consultation routes in Mentee navigation.

--------------------------------------------------
KEY PRINCIPLE
--------------------------------------------------

The sidebar must reflect what the user selected as roles.
No irrelevant enterprise consultation items should appear for a Mentee-only user.
Only Talent Referral remains as the enterprise-related tool in Mentee view.