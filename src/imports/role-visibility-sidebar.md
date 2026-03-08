Unify role visibility logic and sidebar visual design across Mentee and Mentor dashboards.

--------------------------------------------------
1) TOP GLOBAL ROLE SWITCHER (Next to Logo)
--------------------------------------------------

Keep three role buttons visible at all times:

• Mentee
• Mentor
• Business Consultant

Role state rules:

If role is activated:
• Normal brand color
• Clickable
• Active role is filled style

If role is NOT activated:
• Show in soft red outline
• Red text color
• Subtle lock icon
• Still clickable (opens activation page)

Example state:
Business Consultant (red outline + lock icon)

--------------------------------------------------
2) LEFT SIDEBAR — YOUR ROLES SECTION
--------------------------------------------------

At the top of the sidebar:

Section title:
YOUR ROLES

Display ONLY activated roles here.

Example:
If user activated Mentee + Mentor:
Show only:
[Mentee] [Mentor]

If Business Consultant is NOT activated:
Do NOT show it here.

Activated roles:
• Pill style
• Active role filled
• Inactive but activated role outlined

--------------------------------------------------
3) SIDEBAR VISUAL CONSISTENCY
--------------------------------------------------

Mentor sidebar design must visually match Mentee sidebar:

Design rules:
• Same typography scale
• Same icon size
• Same indentation for sub-items
• Same divider spacing
• Same collapsible section behavior
• Same badge style (small rounded badge, not large circle)
• Same padding and alignment

No different styling between roles.

--------------------------------------------------
4) ROLE-BASED SIDEBAR STRUCTURE
--------------------------------------------------

Each role has independent sidebar items,
but visual system must remain identical.

Example structure:

Mentee:
• Dashboard
• My Profile
• Scheduled Mentorship
• Instant Mentorship
• Courses

Mentor:
• Mentor Dashboard
• Scheduled Mentorship (Requested / Upcoming / Calendar)
• Instant Queue
• Workshops
• Availability

Business Consultant:
• Consultant Dashboard
• Advisory Projects
• Talent Referral
• Enterprise Engagement

--------------------------------------------------
5) ROLE CLICK BEHAVIOR
--------------------------------------------------

If user clicks an unactivated role:

• Do NOT show dashboard
• Replace right panel with activation page
• Keep sidebar visible
• Keep global role switcher visible

--------------------------------------------------
6) DESIGN STYLE
--------------------------------------------------

• Clean SaaS layout
• Consistent role visual language
• Red only used for unactivated role indicator
• No harsh error styling
• Maintain premium professional tone