Modify the Mentor Dashboard.

Under "INSTANT MENTORSHIP" in the left sidebar:
Remove:
- Go Online / Offline
- Set Instant Rate

Keep only:
Available Time Windows  >

Clicking this should open a dedicated page:
Route: /app/mentor/availability

----------------------------------------
AVAILABLE TIME WINDOWS PAGE
----------------------------------------

Page Title:
Available Time Windows

Subtitle:
Set your availability for the next 14 days. PhxNorth auto-converts across time zones.

----------------------------------------
SECTION 1 – Location & Coverage
----------------------------------------

Base Country / Region (Required)
- Searchable dropdown
- Auto-detect timezone
- Allow manual timezone override

Open To (Multi-select)
- Searchable dropdown
- Default includes Base Country
- Controls which countries can request instant sessions

----------------------------------------
SECTION 2 – 14-Day Availability Planner
----------------------------------------

Default: Show next 14 days (starting today)

Two tabs:
- Weekly View
- Date List View

Each day:
- Add multiple time slots (e.g. 09:00–12:00, 14:00–18:00)
- Copy to other days
- Copy to next week
- Apply weekday template (Mon–Fri)

Each time slot:
- Start Time
- End Time
- Session Length (30 / 45 / 60 mins)
- Buffer Time (0 / 5 / 10 / 15 mins)
- Toggle: Enabled / Disabled

Show:
- Your Local Time
- UTC (small secondary label)

Validation:
- End time must be after start time
- No overlapping time slots per day
- Base Country must be selected

Sticky primary button:
Save Availability

----------------------------------------
SECTION 3 – Global Time Conversion View
----------------------------------------

Title:
See it in other time zones

Field:
View As Country / Region (searchable dropdown)

Display:
Convert all 14-day availability into selected region’s local time.

Show:
- Their Local Time
- Your Local Time (small label)

Optional toggle:
Show open regions side-by-side

When enabled:
Display 2–3 regions in columns (horizontal scroll if more).

----------------------------------------
SYSTEM RULES
----------------------------------------

- All time slots stored in UTC.
- Displayed in selected region’s local time.
- Open To controls who can send instant requests.
- Scheduled mentorship is not affected.

----------------------------------------
STYLE
----------------------------------------

- Clean card layout
- Use existing PhxNorth design system
- No excessive color
- Clear visual hierarchy
- Time slots displayed as editable chips
- Primary button: deep blue