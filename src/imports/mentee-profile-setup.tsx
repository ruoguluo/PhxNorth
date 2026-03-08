Create a brand new page for the Mentee role:

Route:
 /app/mentee/profile-setup

This page must NOT reuse /app/dashboard.
Do NOT modify the existing dashboard.
This is a completely separate page.

After user selects "Mentee" role on the welcome page:
→ Redirect immediately to /app/mentee/profile-setup
→ Do NOT allow access to dashboard before profile setup.

Now build the full Profile Setup UI on this new page.

PAGE STRUCTURE:

Use a 2-column layout:

LEFT SIDEBAR (fixed, always visible):

Title: "Profile Setup"

Below it:
- Profile completeness progress bar (0%)
- Sections list (clickable navigation):
   • Overview
   • Education Timeline
   • Career Timeline
   • Business / Projects
   • Certifications (+ add)
   • Professional Training (+ add)
   • Psychometric Tests (+ add)
   • Privacy Settings

Bottom:
- Save Draft button
- Continue to 5D Analysis (disabled until required fields confirmed)

RIGHT MAIN CONTENT:

STEP 1 – Import or Build Profile

Header:
"Build Your 5D Profile"

Subtext:
"Import fast, review AI suggestions, and confirm accuracy."

Three large cards:
1) Upload Resume (PDF/DOC)
2) Import LinkedIn
3) Fill Using PhxNorth Form

After selection:
Show AI Parsed Draft Panel.

AI PARSED DRAFT PANEL:

For every extracted field:
- Show the AI suggestion
- Show confidence level
- Checkbox: "Confirm this is correct"
- Edit button

Continue button disabled until user confirms required fields:
Required:
- Current title
- Primary industry (Level 1 + Level 2)
- Country
- At least one timeline entry

TIMELINE EDITOR DESIGN:

Each of these is its own editable block:

EDUCATION
CAREER
BUSINESS / PROJECTS

Each entry includes:
- Date range
- Title / Role
- Organisation (with "Hide organisation name" toggle)
- Country
- Industry classification

Industry must use cascading dropdown:
Level 1 (broad sector)
Level 2 (sub-sector)

If organisation is hidden:
→ Title required
→ Industry required

MODULAR ADD SECTIONS:

User can click "+ Add Section"

Options:
- Certification
- Professional Training
- Psychometric Test
- Custom

When adding:
AI first shows 5-8 suggested items based on user domain.
If not found:
→ "Search full list"
→ "Type manually"
If typed manually:
AI suggests best-fit category and user confirms.

PRIVACY CONTROLS:

Each section has:
- Public
- Private
- Custom visibility

Company name can be hidden.
Title cannot be hidden.

Do NOT include:
- Dashboard metrics
- Projects list
- Courses
- Compliance score
- Welcome back header

This page must feel like an onboarding builder, not a dashboard.