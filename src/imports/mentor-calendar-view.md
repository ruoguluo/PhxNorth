Design the "Calendar View" page inside the Mentor Portal under Scheduled Mentorship.

This calendar must support:
1) Day / Week / Month appointment views
2) Multi-timezone display (more than one timezone at the same time)

--------------------------------------------------
NAV CONTEXT
--------------------------------------------------

In the left sidebar:
SCHEDULED MENTORSHIP (collapsible)
• Mentorship Requested (badge)
• Upcoming Sessions (badge)
• Calendar View (active)

Calendar View is clickable and opens this page.

Route requirement (if applicable):
Use /app/mentor/calendar

--------------------------------------------------
PAGE TITLE
--------------------------------------------------

Calendar

Subtitle:
Manage your appointments across time zones

--------------------------------------------------
TOP CONTROL BAR
--------------------------------------------------

Left:
• Date selector (Today button + mini date picker)
• Search (optional)

Center:
View toggle segmented control:
[ Day ] [ Week ] [ Month ]

Right:
Multi-timezone selector:
• Primary timezone dropdown (default: user locale)
• + Add timezone button
• Show up to 2–3 timezones in parallel
• Ability to remove a timezone (x)

Example display:
Timezone: London (GMT)  |  Beijing (CST)  |  San Francisco (PT)

--------------------------------------------------
CALENDAR LAYOUT
--------------------------------------------------

DAY VIEW:
• Vertical timeline (e.g., 08:00–20:00)
• Each appointment block shows:
  - Mentee avatar + name
  - Session type (Scheduled / Instant)
  - Start–end time
  - Status (confirmed / pending / awaiting reply)
• Multi-timezone display:
  - Show time labels with stacked timezone stamps OR
  - Show dual time line on the left (two columns of time labels)

WEEK VIEW:
• Standard week grid
• Multi-timezone display option:
  - A small timezone strip at top of each day column showing converted time ranges
  - Hover tooltip shows all selected timezone times for that session

MONTH VIEW:
• Month grid with dots / compact blocks
• Clicking a day opens a right-side drawer with that day's appointments
• Drawer shows appointments with multi-timezone times

--------------------------------------------------
MULTI-TIMEZONE BEHAVIOR
--------------------------------------------------

The user can select 2+ timezones.
For each appointment, display:

• Primary time prominently (based on primary timezone)
• Secondary times shown as smaller inline text OR in tooltip:
  "10:00–11:00 London | 18:00–19:00 Beijing"

Provide a toggle:
[ Show secondary timezone on events ] on/off

--------------------------------------------------
APPOINTMENT DETAILS (CLICK EVENT)
--------------------------------------------------

Clicking an appointment opens a right-side details panel:

• Mentee info + 5D Profile quick link
• Big question preview
• Agenda link
• Message shortcut
• Reschedule button (respect 12-hour lock rule if enabled elsewhere)

--------------------------------------------------
DESIGN STYLE
--------------------------------------------------

• Clean SaaS calendar
• Clear hierarchy and spacing
• Subtle status colors
• Premium minimal look
• Focus on clarity for cross-border scheduling