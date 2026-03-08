Design the full content for the "Overview" section inside /app/mentee/profile-setup.

This is NOT a dashboard.
This is the core identity summary before timeline building.

Structure Overview into 5 blocks:

---------------------------------------
BLOCK 1 – Basic Identity (Required)
---------------------------------------

Title: "Core Identity"

Fields:
- First Name (required)
- Last Name (required)
- Current Title (required, cannot be hidden)
- Current Organisation (optional, can toggle “Hide company name”)
- Country / Region (required)
- Primary Industry (required: Level 1 + Level 2 cascading dropdown)
- Years of Experience (dropdown ranges)

Each field should have:
- Edit inline
- AI suggestion (if imported)
- Checkbox: Confirm accuracy

If company name is hidden:
→ Industry becomes mandatory.

---------------------------------------
BLOCK 2 – Professional Focus
---------------------------------------

Title: "Professional Focus"

Fields:
- Functional Expertise (multi-select tags)
- Secondary Industries (optional)
- Markets of Interest (countries/regions)
- Preferred Mentor Geography (optional)
- Career Direction (dropdown: growth / transition / entrepreneurship / advisory / board-level / other)

Small helper text:
"This helps us calibrate mentor matching and opportunity flow."

---------------------------------------
BLOCK 3 – 5D Preview Snapshot
---------------------------------------

Title: "Your 5D Snapshot (Preview)"

This is NOT editable yet.
It shows placeholders based on profile.

Display 5 horizontal bars:
- Hard Skills
- Soft Skills
- Decision Style
- Risk Calibration
- Network Capital

Each shows:
- Status: "Pending analysis" if incomplete
- Tooltip: "Complete profile to unlock detailed analysis"

---------------------------------------
BLOCK 4 – Public Visibility Controls
---------------------------------------

Title: "Profile Visibility"

Global toggle:
- Public
- Private
- Custom

Below:
Checkboxes:
- Show current company
- Show full career timeline
- Allow enterprises to view profile
- Allow mentor discovery visibility

Short text:
"You control what others see. Title remains visible."

---------------------------------------
BLOCK 5 – Completion Status
---------------------------------------

Title: "Profile Completion"

Checklist style:
☐ Core identity confirmed
☐ Industry selected
☐ At least 1 timeline entry
☐ Privacy reviewed

Primary button:
"Continue to Education Timeline"
(Disabled until required confirmations done)

Secondary:
Save Draft

---------------------------------------

Visual Style:
- Use card sections with soft borders.
- Keep clean enterprise aesthetic.
- Overview should feel structured and strategic, not like a simple form.