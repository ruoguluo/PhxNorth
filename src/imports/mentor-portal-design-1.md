Design a premium SaaS Mentor Portal with expandable sidebar navigation.

This is an AI-powered structured mentorship platform.
It is NOT a simple booking tool.

--------------------------------------------------
GLOBAL LAYOUT
--------------------------------------------------

Left Side Navigation (Expandable Menu Style)

Main Section Title:
SCHEDULED MENTORSHIP

This must be a collapsible parent menu item.

When expanded, it reveals three sub-options:

• Mentorship Requested (show notification badge if new)
• Upcoming Sessions (show green badge with number, e.g. 3)
• Calendar View

Visual behavior:
- Parent item has dropdown arrow icon
- Clicking parent expands/collapses sub-menu
- Sub-items are slightly indented
- Active page is highlighted with soft green background

--------------------------------------------------
PAGE 1 — MENTORSHIP REQUESTED (LIST VIEW)
--------------------------------------------------

Clean vertical card layout.

Each Request Card includes:

LEFT:
• Mentee avatar
• Mentee name
• Role tag
• Industry tag

CENTER:
• Big Question preview
• AI suggested total time
• Submitted date

RIGHT:
• Status label:
  - Awaiting Mentor Review
  - Edited – Awaiting Mentee Confirmation
• Button: Review & Structure

--------------------------------------------------
PAGE 2 — REQUEST DETAIL (STRUCTURED SESSION BUILDER)
--------------------------------------------------

This page is an editable structured builder.

TOP SECTION — Mentee Overview

Left:
• Avatar + Name
• 5D Profile Snapshot (mini bar chart)
• Button: View Full 5D Profile

Right:
• Submission date
• Suggested session type
• AI estimated total time

--------------------------------------------------
SECTION 1 — BIG QUESTION (Editable)

• Show original question
• Editable text field
• Option to add mentor notes

--------------------------------------------------
SECTION 2 — STRUCTURED QUESTION AGENDA BUILDER

Display sub-questions as modular editable cards.

Each card includes:

• Drag handle (for reorder)
• Editable question text field
• Editable time estimate (minutes)
• Delete icon

Below list:
• + Add Sub-question button

Top of section:
Dynamic total duration display:
“Total Estimated Session Time: 75 minutes”

This auto recalculates when time is changed.

--------------------------------------------------
MENTOR CONTROL LOGIC

Mentor can:
• Rewrite question wording
• Add sub-questions
• Delete sub-questions
• Reorder via drag-and-drop
• Modify time allocation

--------------------------------------------------
CONFIRMATION FLOW

Primary Action Button:

[ Send Structured Plan to Mentee ]

After click:
• Status becomes:
  Edited – Awaiting Mentee Confirmation
• Banner appears:
  “Waiting for mentee confirmation”

When mentee confirms:
• Session is automatically created
• Session moves to Upcoming Sessions
• Calendar updated
• Notification sent to both parties

--------------------------------------------------
PAGE 3 — UPCOMING SESSIONS

Session cards include:

• Mentee avatar + name
• Session date and time
• Status
• View Session button

--------------------------------------------------
DESIGN STYLE

• Premium SaaS
• Clean grid layout
• Modular editable blocks
• Soft green highlight for active
• Orange for pending confirmation
• Green for confirmed
• Blue for editable fields

This interface must clearly communicate:

Structured mentorship design authority belongs to the mentor.
Session only activates after bilateral confirmation.
The platform is a structured decision infrastructure.