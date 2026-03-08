Design a professional SaaS dashboard for a Mentor Portal.

The platform is an AI-powered structured mentorship system (not just a calendar tool). 
The design must feel premium, structured, decision-oriented, and workflow-driven.

--------------------------------------------------
PAGE 1 — MENTOR DASHBOARD
--------------------------------------------------

Section Title:
SCHEDULED MENTORSHIP

Include:
• Upcoming Sessions (with green notification badge showing number, e.g. 3)
• Calendar View

Upcoming Sessions must be clickable.

--------------------------------------------------
PAGE 2 — UPCOMING SESSIONS LIST
--------------------------------------------------

Display session cards in clean vertical layout.

Each Session Card includes:

LEFT:
• Mentee avatar
• Mentee name
• Role tag (e.g. Founder / Analyst / Student)
• Industry tag

CENTER:
• Date and time
• Duration
• Status label:
  - Confirmed
  - In Preparation
  - Waiting for Mentee
  - Waiting for Mentor
  - New Message (with red dot indicator)

RIGHT:
• View Session button
• Open Messages shortcut (with red notification badge if unread)

--------------------------------------------------
PAGE 3 — SESSION DETAIL PAGE
--------------------------------------------------

This page must feel structured and intelligent.

SECTION 1 — SESSION SUMMARY (Top Area)

Left:
• Mentee avatar and name
• 5D Profile Snapshot (mini horizontal score bars)
• Button: View Full 5D Profile

Center:
• Session Date and Time
• Session Type (Instant / Scheduled)
• Current Stage:
  - Agenda Preparation
  - Active Discussion
  - Post-Session Reflection

Right — Dynamic System Alert Panel:
Show contextual notifications:
• 🔴 New Message (if mentee replied)
• 🔵 Question Updated
• 🔔 Action Required
• ⏰ Reminder (24h before session)
• ⏰ Urgent Reminder (1h before session)

--------------------------------------------------
SECTION 2 — QUESTION STRUCTURE AREA
--------------------------------------------------

A. Initial Big Question
• Full original question text
• Category tags (Career / Strategy / Funding / Leadership)
• Created date

B. AI Structured Question Agenda (collapsible)
• Sub-question 1
• Sub-question 2
• Sub-question 3
Button: View Full Agenda

C. Current Active Question (highlighted card)
• Display current focus sub-question
• Status:
  - Waiting for mentee
  - Waiting for mentor
  - Discussion ongoing

--------------------------------------------------
SECTION 3 — DECISION PROGRESS TRACKER
--------------------------------------------------

Add visual progress bar:

Big Question Completion Progress
Example:
▮▮▮▯▯ 60%

Progress is calculated based on:
• Number of completed sub-questions
• Mentor marked completed
• Mentee confirmed

This tracker should visually reinforce structured progress.

--------------------------------------------------
SECTION 4 — COMMUNICATION PANEL (Right Side Fixed Panel)
--------------------------------------------------

Slack-style messaging panel.

Features:
• Text messages
• File upload
• AI suggestion button (for mentor)
• Timestamp for each message

If new message:
Show banner at top:
🔴 New Message Received

Clicking it scrolls to latest message.

--------------------------------------------------
SESSION RESCHEDULING RULE
--------------------------------------------------

Mentor can edit / reschedule the session only if current time is MORE than 12 hours before the scheduled session time.

UI logic:

If more than 12 hours remaining:
Show button:
[ Reschedule Session ]

If less than 12 hours remaining:
Disable button and show greyed state:
[ Rescheduling Locked ]

With tooltip message:
“Session changes are not allowed within 12 hours of the scheduled start time.”

System must automatically calculate remaining time and dynamically enable/disable the reschedule function.

--------------------------------------------------

Design style:
• Clean SaaS layout
• Structured blocks
• Clear visual hierarchy
• Professional typography
• Subtle color accents for alerts (green / red / blue)
• Minimal but premium look
• Emphasis on decision structure and workflow clarity

This is not a marketplace.
This is a structured decision infrastructure platform.