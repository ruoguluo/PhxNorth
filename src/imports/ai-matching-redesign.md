Redesign the Quick Question AI detection and matching flow.

Current issue:
Static "Auto-detected" labels are insufficient and may be inaccurate.

Replace with intelligent matching flow.

--------------------------------------------------
STEP 1 — AI UNDERSTANDING SUMMARY (User-visible)
--------------------------------------------------

After user inputs question, display:

Title:
We understand your question as:

Show structured interpretation:

• Primary Goal
• Category
• Decision Layer
• Time Horizon (if detected)

Do NOT show internal matching variables.
Do NOT show algorithm details.

--------------------------------------------------
STEP 2 — MATCHING INFORMATION COMPLETION
--------------------------------------------------

If critical matching variables are missing,
display up to 5 follow-up questions.

Title:
To improve mentor matching accuracy, we need a bit more clarity:

Generate up to 5 dynamic questions based on:

• Domain
• User background
• Decision stage
• Missing objective signals

These questions must help gather:

• Objective constraints
• Subjective preferences
• Timeline clarity
• Desired outcome

Do NOT exceed 5 questions.

--------------------------------------------------
MATCHING LOGIC (Hidden from user)
--------------------------------------------------

AI internally evaluates:

Objective matching:
• Domain expertise
• Experience level
• Geography/timezone
• Industry relevance

Subjective matching:
• Communication style
• Depth preference
• Decision complexity tolerance
• Engagement pace

If confidence < threshold:
Trigger follow-up questions.

If confidence ≥ threshold:
Skip follow-up and proceed to matching.

--------------------------------------------------
STEP 3 — MATCHING OUTPUT
--------------------------------------------------

After sufficient information:

Display:
"Finding the most suitable mentors for your goal..."

Then show:
Top mentor matches
Confidence indicator (subtle, not technical)

--------------------------------------------------
DESIGN PRINCIPLES
--------------------------------------------------

• Clean SaaS interface
• No algorithm explanation
• No internal scoring exposure
• Follow-up questions limited to 5
• Focus on improving matching precision
• Intelligent and professional tone