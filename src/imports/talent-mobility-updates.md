Modify the current section by removing the "Explore Active Campaigns" CTA entirely.
Keep ONLY one primary CTA: "Join Talent Mobility →".

Interaction / Navigation Logic:
- When user clicks "Join Talent Mobility →", navigate directly to the user's Personal Portal (not a job list page).
- In the Personal Portal, show a Talent Mobility onboarding flow: Confirm Join → Set Preferences → Completion state.

Do NOT change the overall brand style, typography system, or existing color palette.
Do NOT redesign the whole portal. Only add the Talent Mobility entry, onboarding module, and sidebar item logic.

PAGE / MODULE UPDATES:

1) Landing Section (Current page)
- Remove the entire button "Explore Active Campaigns" and any related icon.
- Keep the button "Join Talent Mobility →" as the single CTA.
- Keep layout balanced after removal (center the remaining CTA or align it with existing grid).

2) Personal Portal (New/Updated state)
Add a new module on the main dashboard area:

Module Title: Talent Mobility
Short description:
"Join a structured talent mobility layer. Set your focus areas and receive real-time opportunity alerts. Track referral progress transparently."

State A (Not Joined Yet)
- Show a prominent card:
  Card Title: Join Talent Mobility
  Body text:
  "Participate in cross-border and cross-industry opportunities.
   Your preferences can be updated anytime."
  Button: [ Confirm & Join ]

On click [Confirm & Join]:
- Transition to State B (Setup)

State B (Setup Preferences)
- Show a setup form with multi-select controls:
  • Country / Region
  • Market
  • Industry
  • Role / Function
  • Seniority Level
- Add helper text:
  "You will receive real-time alerts based on your selected focus areas.
   You can change preferences anytime."

- Primary button: [ Save Preferences ]
- Secondary link/button: [ Skip for now ]

On click [Save Preferences] or [Skip for now]:
- Transition to State C (Joined)

State C (Joined)
- Card shows:
  Status: Joined ✓
  Quick actions:
  [ Edit Preferences ]
  [ View Referral Progress ]

3) Left Sidebar Logic (Important)
- BEFORE joining: do NOT show Talent Mobility in the left sidebar.
- AFTER joining (State C): add a new sidebar category:
  Talent Mobility
    - Preferences
    - Referral Progress
    - Notifications (optional)

4) Referral Progress Entry (Lightweight)
Create a simple dashboard page for "Referral Progress" with a clean list/table:
- Opportunity / Campaign Name
- Source: Self / Referred / Recommended by others
- Current Stage (with small step indicator)
- Last Update date/time
- Action: View details

IMPORTANT:
- Do NOT add or reintroduce "Explore Active Campaigns" anywhere.
- Do NOT present this as a job board.
- Emphasize ecosystem participation, structured preferences, real-time alerts, and transparent progress tracking.
- Keep the UI premium, minimal, and consistent with the existing portal design.