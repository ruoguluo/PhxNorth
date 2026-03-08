Design a premium SaaS Mentor Dashboard for an AI-powered structured mentorship platform.

This is NOT a simple booking marketplace.
This is a structured decision and question-engineering system.

--------------------------------------------------
PAGE 1 — MENTOR DASHBOARD
--------------------------------------------------

Section Title:
SCHEDULED MENTORSHIP

Include three items:

• Mentorship Requested (with notification badge if new)
• Upcoming Sessions (with green badge number)
• Calendar View

Mentorship Requested must be visually distinct if new requests exist.

--------------------------------------------------
PAGE 2 — MENTORSHIP REQUESTED LIST
--------------------------------------------------

Display clean vertical cards for each new request.

Each Request Card includes:

LEFT:
• Mentee avatar
• Mentee name
• Role tag
• Industry tag

CENTER:
• Submitted date
• Big Question title preview
• Estimated total session time (AI suggested)

RIGHT:
• Status:
  - Awaiting Mentor Review
  - Edited – Awaiting Mentee Confirmation
• Button: Review & Structure

--------------------------------------------------
PAGE 3 — REQUEST DETAIL (STRUCTURED SESSION BUILDER)
--------------------------------------------------

This page must feel intelligent and editable.

TOP SECTION — Mentee Overview

Left:
• Avatar + Name
• 5D Profile Snapshot (mini bar view)
• Button: View Full 5D Profile

Right:
• Request submitted date
• Suggested session type
• AI estimated total time

--------------------------------------------------
SECTION 1 — INITIAL BIG QUESTION
--------------------------------------------------

Display original big question.

Editable:
• Mentor can refine wording directly
• Option to add clarifying notes

--------------------------------------------------
SECTION 2 — AI STRUCTURED QUESTION AGENDA (Editable Builder)
--------------------------------------------------

This is the core component.

Display structured sub-questions in vertical modular blocks.

Each sub-question block includes:

• Drag handle (to reorder)
• Question text (editable field)
• Estimated time (editable numeric field in minutes)
• Delete button

Below the list:
• + Add Sub-Question button

Mentor capabilities:
• Rewrite question
• Add sub-questions
• Delete sub-questions
• Reorder sub-questions
• Modify time estimation per question

Show dynamic total session duration calculation at top:
“Total Estimated Time: 75 minutes”

This updates automatically based on edits.

--------------------------------------------------
SECTION 3 — SESSION STRUCTURE SUMMARY PANEL
--------------------------------------------------

Display structured overview:

• Number of sub-questions
• Total estimated time
• Expected outcome summary (editable)

--------------------------------------------------
SECTION 4 — CONFIRMATION FLOW
--------------------------------------------------

Primary Button:

[ Send Structured Plan to Mentee ]

When clicked:

Status changes to:
Edited – Awaiting Mentee Confirmation

System logic:
• Mentee receives updated structured plan
• Mentee must confirm before session is officially created

While waiting:
Show banner:
“Waiting for mentee confirmation”

--------------------------------------------------
APPROVAL LOGIC
--------------------------------------------------

When mentee confirms:

• System automatically creates official session
• Session moves to “Upcoming Sessions”
• Calendar updated
• Notification sent to both parties

--------------------------------------------------
DESIGN STYLE
--------------------------------------------------

• Clean SaaS layout
• Modular editable cards
• Soft neutral background
• Subtle color coding:
  - Blue for editable elements
  - Green for confirmed
  - Orange for pending confirmation
• Emphasis on structured workflow control

This interface should communicate:
Mentor has structural authority over the session design.
The system enforces collaborative confirmation before activation.

The platform is a structured decision infrastructure, not a simple booking tool.