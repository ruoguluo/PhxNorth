# PhxNorth E2E Test Cases

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@phxnorth.com` | `admin123` |
| Mentor 1 | `sarah.mentor@phxnorth.com` | `mentor123` |
| Mentor 2 | `david.mentor@phxnorth.com` | `mentor123` |
| Mentor 3 | `elena.mentor@phxnorth.com` | `mentor123` |
| Mentee 1 | `chen.mentee@phxnorth.com` | `mentee123` |
| Mentee 2 | `michael.mentee@phxnorth.com` | `mentee123` |
| Mentee 3 | `aisha.mentee@phxnorth.com` | `mentee123` |

---

## P0 — Critical Path (Must Pass)

### TC-01: Mentee Login → Dashboard

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/login` | Login form displayed |
| 2 | Enter `chen.mentee@phxnorth.com` / `mentee123` | Fields accept input |
| 3 | Click "Sign In" | `POST /api/auth/login` returns token |
| 4 | Wait for redirect | Navigates to `/app/dashboard` |
| 5 | Verify dashboard | Stat cards show real numbers (Active Questions, Mentor Matches, 5D Growth, Next Session) |
| 6 | Verify upcoming sessions | At least 1 upcoming session card displayed |

### TC-02: Mentor Login → Dashboard

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `sarah.mentor@phxnorth.com` / `mentor123` | Success |
| 2 | Wait for redirect | Navigates to `/app/mentor/dashboard` |
| 3 | Verify KPI cards | Sessions this week, Active Mentees, Average Rating, Monthly Income show real data |
| 4 | Verify "View Details" links | Click each → navigates to `/app/mentor/upcoming`, `/app/mentor/requests`, `/app/profile`, `/app/billing` |
| 5 | Verify Enterprise Consulting card | Shows "3 projects waiting" (from seed data) |
| 6 | Verify Workshop card | Shows workshop count |
| 7 | Verify hourly rate | Rate input pre-filled with $150 (seeded) |

### TC-03: Admin Login → Dashboard

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `admin@phxnorth.com` / `admin123` | Success |
| 2 | Navigate to `/app/admin` | Admin dashboard renders |
| 3 | Verify platform stats | Total Users, Total Revenue, Avg Rating, Pending Reviews displayed |
| 4 | Verify DISC Data table | Shows users with DISC data if behavioral backend is running |

### TC-04: Mentee Quick Question → Mentor Matching → Request Session

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `chen.mentee@phxnorth.com` | Dashboard loaded |
| 2 | Click "Ask a Quick Question" card | Navigates to `/app/question-entry?type=quick` |
| 3 | Type "How do I transition from engineering to product management?" (>10 chars) | Input accepted, Next button enabled |
| 4 | Click Next | `POST /api/v1/questions/interpret` called, AI returns understanding + assumed goal |
| 5 | Select a stage option | Stage set |
| 6 | Proceed through clarification (if any) | Questions displayed |
| 7 | Click "Find Mentors" | `POST /api/mentorship/match`, mentor grid displayed |
| 8 | Verify mentor cards | Cards show name, expertise, match score, availability, hourly rate |
| 9 | Click "Start Now" on an online mentor | Request Session modal opens |
| 10 | Verify price display | If mentor has rate, shows "Estimated Session Cost: $X" |
| 11 | Fill topic, select 30min, click "Send Request" | `POST /api/mentorship/requests` with calculated price |
| 12 | Verify success | "Request Sent!" confirmation shown |

### TC-05: Mentor Accept Request → Session Created

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `sarah.mentor@phxnorth.com` | Mentor dashboard loaded |
| 2 | Check pending requests section | At least 1 pending request visible |
| 3 | Navigate to `/app/mentor/requests` | Requests list loaded |
| 4 | Click on a pending request | Navigates to `/app/mentor/request/:id` |
| 5 | Click "Accept" | `PUT /api/mentorship/requests/:id/respond` with `action: "accept"` |
| 6 | Verify | Request status changes to "accepted", session auto-created |
| 7 | Navigate to `/app/mentor/upcoming` | New session appears in the list |

### TC-06: Session Detail + Messaging

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentor, navigate to `/app/mentor/upcoming` | Sessions listed |
| 2 | Click on a session | Navigates to `/app/session/:id` |
| 3 | Verify session info | Topic, date/time, duration, price, mentee info displayed |
| 4 | Type a message in the chat input | Message field accepts input |
| 5 | Press Enter or click Send | `POST /api/messages/session/:id`, message appears in chat |
| 6 | Login as the mentee in another browser | Navigate to same session |
| 7 | Verify message received | Mentor's message visible |

### TC-07: Registration Flow

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/role-selection` | 3 role cards displayed (Mentee, Mentor, Enterprise) |
| 2 | Click "Mentee" | Navigates to `/create-account?type=mentee` |
| 3 | Step 1: Fill name, username, degree, experience | Fields validate |
| 4 | Step 2: Select country, interested countries | Dropdowns work |
| 5 | Step 3: Select industry, sector | Cascading dropdowns work |
| 6 | Step 4: Enter email, password, confirm password | Validation on password match |
| 7 | Click "Create Account" | `POST /api/auth/register` succeeds |
| 8 | Verify | Token stored, redirect to `/app/dashboard` |

---

## P1 — Important Flows

### TC-08: Mentee Find Mentor + Filter

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentee, navigate to `/app/find-mentor` | Mentor grid loaded |
| 2 | Filter by "Technology" industry | Grid filters, only tech mentors shown |
| 3 | Toggle "Online Only" | Only online mentors displayed |
| 4 | Click "Request Mentorship" on a mentor | Request modal opens with mentor info + price |

### TC-09: Mentor Set Hourly Rate

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `david.mentor@phxnorth.com` | Mentor dashboard |
| 2 | Find "Your Hourly Rate" section | Input shows current rate ($200) |
| 3 | Change to $250, click "Save" | `PUT /api/profile` with `hourly_rate: 250` |
| 4 | See "Saved!" confirmation | Button briefly shows green "Saved!" |
| 5 | Refresh page | Rate persists at $250 |

### TC-10: Mentor Toggle Online/Offline

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentor | Dashboard loaded |
| 2 | Click online/offline toggle | `PUT /api/profile/online-status`, status switches |
| 3 | Refresh page | Status persists |

### TC-11: Workshop CRUD (Mentor)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `sarah.mentor@phxnorth.com`, go to `/app/mentor/workshops` | Workshop list loaded (2 from seed) |
| 2 | Click "Create Workshop" | Create form appears |
| 3 | Fill title "React Masterclass", description, schedule, 20 max, $60 | Fields accept input |
| 4 | Submit | `POST /api/workshops`, new workshop appears in list with "Draft" status |
| 5 | Click Publish on the new workshop | `PUT /api/workshops/:id/publish`, status changes to "Published" |
| 6 | Delete a draft workshop | `DELETE /api/workshops/:id`, workshop removed from list |

### TC-12: Consulting Apply (Mentor)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentor, go to `/app/mentor/consulting` | "Available Projects" tab shows 3 open projects |
| 2 | Click "Apply to this project" on first project | Application form expands |
| 3 | Enter proposal text + proposed rate $180 | Fields accept input |
| 4 | Click "Submit Application" | `POST /api/consulting/projects/:id/apply` |
| 5 | Verify | "Application submitted" shown, switch to "My Applications" tab, new entry visible |

### TC-13: Profile Setup + Summary

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `chen.mentee@phxnorth.com`, go to `/app/mentee/profile-setup` | Page loads with existing data from API |
| 2 | Verify Overview section | Name, country, industry pre-filled from seed |
| 3 | Click "Summary & Tags" in sidebar | Summary section appears |
| 4 | Type bio in textarea, click "Save Summary" | `PUT /api/profile` with `{ summary }` |
| 5 | Navigate to `/app/profile` | Summary text displayed |
| 6 | Click "Edit Profile" button | Returns to `/app/mentee/profile-setup` |

### TC-14: Profile Setup + Timeline CRUD

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentee, go to `/app/mentee/profile-setup` | Page loaded |
| 2 | Click "Education" in sidebar | Education timeline loaded (2 entries from seed) |
| 3 | Add new education entry: "MBA, Harvard, 2025-09" | Form accepts input |
| 4 | Save | `POST /api/profile/timeline`, new entry appears |
| 5 | Edit the entry, change title to "MBA Program" | `PUT /api/profile/timeline/:id` |
| 6 | Delete the entry | `DELETE /api/profile/timeline/:id`, entry removed |

### TC-15: CV Upload → 5D Snapshot

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentee, go to `/app/cv-upload` | Upload page with File/Text tabs |
| 2 | Upload a PDF resume | `POST /api/v1/users/me/cv/upload` |
| 3 | Wait for processing | Status polling shows queued → processing → completed |
| 4 | Navigate to `/app/5d-snapshot` | DISC radar chart renders with scores |
| 5 | Verify 5 dimensions | Capability, Execution, Decision, Collaboration, Growth have values |
| 6 | Verify Matching Readiness | Mentorship/Enterprise readiness cards show levels |

### TC-16: Billing (All Roles)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentee, go to `/app/billing` | Shows Total Spent, payment history |
| 2 | Login as mentor, go to `/app/billing` | Shows Earnings, Pending Payout, Paid Out, payment + payout history |
| 3 | Login as admin, go to `/app/billing` | Shows GMV, Fees, Mentor Earnings, "Run Payouts" button |
| 4 | (Admin) Click "Run Payouts" | `POST /api/billing/payouts/run`, payout triggered |

### TC-17: Messages

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentee, go to `/app/messages` | Conversation list loaded |
| 2 | Click on a conversation | Message thread loads |
| 3 | Type "Hello!" and press Enter | `POST /api/conversations/:id/messages`, message appears right-aligned |
| 4 | Verify unread count updates | After sending, conversation shows in list |

### TC-18: 5D Snapshot (with data)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as user with DISC data, go to `/app/5d-snapshot` | Page loads |
| 2 | Verify radar chart | 5 dimensions plotted |
| 3 | Verify SPI score | Numeric score displayed |
| 4 | Verify career analytics | If career data exists, analytics section populated |
| 5 | Verify matching readiness | Mentorship + Enterprise readiness shown with levels |

---

## P2 — Edge Cases

### TC-19: Login with Wrong Password

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/login` | Login form |
| 2 | Enter `chen.mentee@phxnorth.com` / `wrongpass` | Fields accept input |
| 3 | Click "Sign In" | Error: "Login failed. Please check your credentials." |
| 4 | Verify | No redirect, no token stored |

### TC-20: Mentor Redirected from Mentee Dashboard

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `sarah.mentor@phxnorth.com` | Redirected to `/app/mentor/dashboard` |
| 2 | Manually navigate to `/app/dashboard` | Dashboard detects mentor role |
| 3 | Verify | Redirected to `/app/mentor/dashboard` or shows mentor-appropriate content |

### TC-21: Empty States (New User)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Register a new mentee account | Dashboard loads |
| 2 | Verify empty states | No upcoming sessions message, no mentorship tracks |
| 3 | Navigate to `/app/5d-snapshot` | Shows "No data yet" with CTA to upload CV |
| 4 | Navigate to `/app/messages` | Shows empty conversations list |

### TC-22: Privacy Toggles

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login, go to `/app/profile` | Privacy & Visibility section visible |
| 2 | Change "Profile Visibility" to "private" | `PUT /api/profile` with `global_visibility: "private"` |
| 3 | Change "Show Current Company" to "hidden" | `PUT /api/profile` with `show_current_company: false` |
| 4 | Change "Mentor Discovery" to "hidden" | `PUT /api/profile` with `allow_mentor_discovery: false` |
| 5 | Refresh page | All settings persisted |

### TC-23: Structured Question Flow

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentee, go to `/app/question-entry?type=structured` | Multi-step form |
| 2 | Step 1: Fill domain, context, outcome, timeframe, criteria | All fields validate |
| 3 | Click "Generate Agenda" | `POST /api/v1/questions/agenda`, AI returns sub-questions |
| 4 | Review agenda | Sub-questions displayed with depth levels |
| 5 | Click "Find Mentors" | Mentor matching grid displayed |

### TC-24: Session Completion with Rating

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentor with an upcoming session | Session detail loaded |
| 2 | Click "Complete Session" | Rating/feedback modal appears |
| 3 | Select 5 stars, enter feedback "Great session" | Fields accept input |
| 4 | Submit | `PUT /api/mentorship/sessions/:id/complete` with `{ rating: 5, feedback }` |
| 5 | Verify | Session status → "completed", rating saved |

### TC-25: Mentor Calendar View

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as mentor, go to `/app/mentor/calendar` | Calendar renders |
| 2 | Verify sessions on calendar | Upcoming sessions shown as events |
| 3 | Click on a session event | Detail panel opens with mentee info |
| 4 | Click "Join Session" | Navigates to `/app/session/:id` |
| 5 | Click "Send Message" | Navigates to `/app/messages` |
