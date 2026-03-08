Update the app sidebar information architecture to use a role switcher at the top of the left sidebar, and relocate Talent Referral into the Business Consultant role only.

--------------------------------------------------
GLOBAL RULE — ROLE SWITCHER (TOP OF SIDEBAR)
--------------------------------------------------

Keep the "YOUR ROLES" section at the very top of the left sidebar.

Roles to display (as pills/tabs):
• Mentee
• Mentor
• Business Consultant

Behavior:
• Only roles the user has activated are shown (if applicable)
• Active role is highlighted
• Clicking a role switches to that role’s dashboard + sidebar menu
• Do NOT show Workshop Speaker

--------------------------------------------------
ROLE-SPECIFIC SIDEBARS
--------------------------------------------------

A) MENTEE SIDEBAR (REMOVE TALENT REFERRAL)
Keep Mentee tools such as:
• Dashboard
• My Profile (Update Profile, 5D Snapshot)
• Scheduled Mentorship (Ongoing, Completed)
• Instant Mentorship
• Mentorship Courses (Enrolled, Course Library)

REMOVE from Mentee:
• Talent Referral module and any referral sub-items

--------------------------------------------------

B) MENTOR SIDEBAR (REMOVE TALENT REFERRAL)
Keep Mentor tools such as:
• Mentor Dashboard / Operations Center
• Scheduled Mentorship (Requested, Upcoming, Calendar)
• Instant Mentorship Queue
• Workshops (as a mentor service module, if used)
• Profile / Availability (if used)

REMOVE from Mentor:
• Talent Referral module and any referral sub-items

--------------------------------------------------

C) BUSINESS CONSULTANT SIDEBAR (ADD TALENT REFERRAL HERE)
Business Consultant tools should include:

Section: Business Consultant Tools
• Consultant Dashboard (or Operations Center)
• Advisory Projects (Ongoing, Completed)
• Enterprise Engagement (optional label if needed)

Add Talent Referral module ONLY here:

Talent Referral (collapsible)
• Ongoing Referrals (show badge count)
• Completed Referrals

Badges:
• Small rounded badges for counts (no large circles)
• Use subtle orange/neutral accent

--------------------------------------------------
ROUTING / NAVIGATION (CONSISTENCY)
--------------------------------------------------

Ensure routes are role-scoped:

Mentee:
 /app/mentee/dashboard
 /app/mentee/profile
 /app/mentee/mentorship/...
 /app/mentee/courses/...

Mentor:
 /app/mentor/dashboard
 /app/mentor/requests
 /app/mentor/upcoming
 /app/mentor/calendar
 /app/mentor/availability
 /app/mentor/workshops (if applicable)

Business Consultant:
 /app/consultant/dashboard
 /app/consultant/projects/ongoing
 /app/consultant/projects/completed
 /app/consultant/referrals/ongoing
 /app/consultant/referrals/completed

Do NOT show /app/consultant/referrals links under mentee or mentor sidebars.

--------------------------------------------------
KEY PRINCIPLE
--------------------------------------------------

Talent Referral is an enterprise/business function.
It must live inside the Business Consultant role only,
and be removed from both Mentee and Mentor dashboards.