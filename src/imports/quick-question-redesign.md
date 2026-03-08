Redesign the Quick Question flow to include user confirmation and structured triage.

The AI interpretation MUST be confirmable and editable by the user.

Do NOT expose matching algorithm details to the user.
Only show structured understanding + follow-up questions (max 5).

--------------------------------------------------
STEP 0 — USER QUESTION INPUT
--------------------------------------------------
User enters a question.

--------------------------------------------------
STEP 1 — COUNTRY / REGION (Always First)
--------------------------------------------------
Show detected country/region and allow edit.

Fields:
• Country/Region (required)
• City/Timezone (optional)
• Language preference (optional)

--------------------------------------------------
STEP 2 — CATEGORY (Always Second)
--------------------------------------------------
User selects one of:
• Education
• Career
• Business
• Entrepreneurship

Display as 4 cards with examples.

--------------------------------------------------
STEP 3 — CATEGORY-SPECIFIC STRUCTURED DETAILS
--------------------------------------------------
For the selected category, collect structured details:

Common structure for all categories:
• Stage (where the user is in the process)
• Goal/Outcome (what success looks like)
• Direction certainty (confirmed / comparing / exploring)
• Constraints (time/budget/geography/resources)
• Success criteria

Education sub-structure includes:
• Subtype: Admissions / Exams / Academic / Research / Planning / International
• Admissions stage options: direction/major, shortlist, personal statement, recommendations, interview prep, portfolio/competitions, submission strategy

Career sub-structure includes:
• Subtype: job search, transition, promotion, workplace, skill growth, negotiation
• Stage options: exploring, targeting roles, resume/LinkedIn, interviewing, offer stage, first 90 days

Business sub-structure includes:
• Subtype: strategy, sales/BD, marketing/growth, ops, product/delivery, finance/compliance, people/org
• Stage: framing, diagnosis, option design, execution plan, review

Entrepreneurship sub-structure includes:
• Subtype: validation, MVP build, GTM, fundraising, hiring, business model, legal/finance setup
• Stage: ideation, validation, MVP, launch, growth, fundraising cycle

--------------------------------------------------
STEP 4 — AI UNDERSTANDING SUMMARY + USER CONFIRMATION
--------------------------------------------------
Show:
"We understand your question as:"

Display:
• Country/Region
• Category
• Subtype
• Stage
• Primary Goal
• Time horizon (if known)

Add explicit controls:
[ Confirm ]  [ Edit ]  [ Not correct / Reclassify ]

If user clicks Not correct:
Return to Step 1–3 and ask up to 5 follow-up questions to fill missing info.

--------------------------------------------------
STEP 5 — MATCHING (Hidden logic)
--------------------------------------------------
After user confirms,
proceed to matching.

If critical info is missing:
Ask up to 5 follow-up questions (max 5) to improve matching accuracy.

Do NOT show algorithm or weighting.
Only ask for user cooperation.

Design style:
• Clean SaaS wizard
• Step-based
• Professional, structured tone
• No incorrect auto-labels without user confirmation