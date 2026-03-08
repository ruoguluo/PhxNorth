Redesign the Quick Question AI flow to minimize user workload.

Principle:
The system should infer as much as possible from:
• User profile data
• Question content
• Standard journey templates

Users should confirm assumptions rather than fill forms.

--------------------------------------------------
STEP 1 — AI ASSUMED GOAL
--------------------------------------------------

After user inputs question,
generate a structured assumed goal based on:

• Detected institution
• Detected program/major
• User profile (student level)
• Current calendar year
• Standard admission cycles

Display:

"We understand your goal as:"

• Institution (auto-expanded, e.g., Oxford University)
• Program level (Undergraduate by default if user is student)
• Major
• Target intake (based on current year & typical cycles)

Show buttons:
[ Yes, this is correct ]
[ Edit details ]

Do NOT show internal algorithm or categories.

--------------------------------------------------
STEP 2 — STAGE CONFIRMATION
--------------------------------------------------

After confirmation,
ask only ONE key stage question based on standard journey map.

Example for UK Undergraduate Admissions:

"Which stage best describes you right now?"

Options:
• Still deciding direction
• Preparing application materials
• Drafting personal statement
• Preparing for interview
• Already submitted

--------------------------------------------------
STEP 3 — STRUCTURED JOURNEY ACTIVATION
--------------------------------------------------

Based on stage selection,
activate a predefined journey template for:

Education → UK → Undergraduate → Oxford → Chemistry

Generate structured sub-goals and next actions.

Do NOT ask unnecessary additional questions.

Ask at most 1–2 clarification questions only if critical data is missing.

--------------------------------------------------
DESIGN PRINCIPLES
--------------------------------------------------

• Minimize user input
• Infer intelligently
• Confirm assumptions
• Use standard journey templates
• Professional, structured tone
• No auto-mislabeling without confirmation