import { createBrowserRouter, Navigate, redirect } from "react-router";
import { Landing } from "./pages/Landing";
import { Individuals } from "./pages/Individuals";
import { Mentors } from "./pages/Mentors";
import { Enterprises } from "./pages/Enterprises";
import { HowItWorks } from "./pages/HowItWorks";
import { Advantage } from "./pages/Advantage";
import { FiveDMentorship } from "./pages/FiveDMentorship";
import { TalentMobility } from "./pages/TalentMobility";
import { TalentMobilityPortal } from "./pages/TalentMobilityPortal";
import { TalentMobilityPreferences } from "./pages/TalentMobilityPreferences";
import { TalentMobilityCampaigns } from "./pages/TalentMobilityCampaigns";
import { TalentMobilityReferrals } from "./pages/TalentMobilityReferrals";
import { TalentMobilityNotifications } from "./pages/TalentMobilityNotifications";
import { CommercialAdvisory } from "./pages/CommercialAdvisory";
import { Login } from "./pages/Login";
import { AccountTypeSelection } from "./pages/AccountTypeSelection";
import { LoginTypeSelection } from "./pages/LoginTypeSelection";
import { RoleSelection } from "./pages/RoleSelection";
import { RoleSelectionNew } from "./pages/RoleSelectionNew";
import { CreateAccount } from "./pages/CreateAccount";
import { PreRoleWelcome } from "./pages/PreRoleWelcome";
import { MenteeProfileSetup } from "./pages/MenteeProfileSetup";
import { MenteeDashboard } from "./pages/MenteeDashboard";
import { MenteeQuestionEntry } from "./pages/MenteeQuestionEntry";
import { MentorDashboard } from "./pages/MentorDashboard";
import { MentorAvailability } from "./pages/MentorAvailability";
import { MentorCalendar } from "./pages/MentorCalendar";
import { MentorWorkshops } from "./pages/MentorWorkshops";
import { UpcomingSessionsList } from "./pages/UpcomingSessionsList";
import { SessionDetail } from "./pages/SessionDetail";
import { MentorshipRequests } from "./pages/MentorshipRequests";
import { RequestDetail } from "./pages/RequestDetail";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Courses } from "./pages/Courses";
import { CourseDetail } from "./pages/CourseDetail";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Profile } from "./pages/Profile";
import { FiveDSnapshot } from "./pages/FiveDSnapshot";
import { PublicProfile } from "./pages/PublicProfile";
import { WorkshopsExplore } from "./pages/WorkshopsExplore";
import { InstantMentorshipExplore } from "./pages/InstantMentorshipExplore";
import { StructuredMentorshipExplore } from "./pages/StructuredMentorshipExplore";
import { MentorshipProgramsExplore } from "./pages/MentorshipProgramsExplore";
import { GlobalTalentMobilityExplore } from "./pages/GlobalTalentMobilityExplore";
import { CommercialConsultationExplore } from "./pages/CommercialConsultationExplore";
import { NotFound } from "./pages/NotFound";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/individuals",
    Component: Individuals,
  },
  {
    path: "/mentors",
    Component: Mentors,
  },
  {
    path: "/enterprises",
    Component: Enterprises,
  },
  {
    path: "/how-it-works",
    Component: HowItWorks,
  },
  {
    path: "/advantage",
    Component: Advantage,
  },
  {
    path: "/why-phxnorth",
    Component: Advantage,
  },
  {
    path: "/5d-mentorship",
    Component: FiveDMentorship,
  },
  {
    path: "/talent-mobility",
    Component: TalentMobility,
  },
  {
    path: "/talent-mobility-portal",
    Component: TalentMobilityPortal,
  },
  {
    path: "/talent-mobility-portal/preferences",
    Component: TalentMobilityPreferences,
  },
  {
    path: "/talent-mobility-portal/campaigns",
    Component: TalentMobilityCampaigns,
  },
  {
    path: "/talent-mobility-portal/referrals",
    Component: TalentMobilityReferrals,
  },
  {
    path: "/talent-mobility-portal/notifications",
    Component: TalentMobilityNotifications,
  },
  {
    path: "/commercial-advisory",
    Component: CommercialAdvisory,
  },
  {
    path: "/profile/:name",
    Component: PublicProfile,
  },
  {
    path: "/workshops",
    Component: WorkshopsExplore,
  },
  {
    path: "/instant-mentorship",
    Component: InstantMentorshipExplore,
  },
  {
    path: "/structured-mentorship",
    Component: StructuredMentorshipExplore,
  },
  {
    path: "/mentorship-programs",
    Component: MentorshipProgramsExplore,
  },
  {
    path: "/global-talent-mobility",
    Component: GlobalTalentMobilityExplore,
  },
  {
    path: "/commercial-consultation",
    Component: CommercialConsultationExplore,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/account-type-selection",
    Component: AccountTypeSelection,
  },
  {
    path: "/login-type-selection",
    Component: LoginTypeSelection,
  },
  {
    path: "/role-selection",
    Component: RoleSelection,
  },
  {
    path: "/role-selection-new",
    Component: RoleSelectionNew,
  },
  {
    path: "/create-account",
    Component: CreateAccount,
  },
  {
    path: "/welcome",
    Component: PreRoleWelcome,
  },
  {
    path: "/app/mentee/profile-setup",
    Component: MenteeProfileSetup,
  },
  {
    path: "/app",
    Component: Layout,
    children: [
      {
        index: true,
        loader: () => redirect("/app/mentor/dashboard"),
      },
      {
        path: "dashboard",
        Component: MenteeDashboard,
      },
      {
        path: "question-entry",
        Component: MenteeQuestionEntry,
      },
      {
        path: "mentor",
        children: [
          {
            index: true,
            loader: () => redirect("/app/mentor/dashboard"),
          },
          {
            path: "dashboard",
            Component: MentorDashboard,
          },
          {
            path: "availability",
            Component: MentorAvailability,
          },
          {
            path: "calendar",
            Component: MentorCalendar,
          },
          {
            path: "workshops",
            Component: MentorWorkshops,
          },
          {
            path: "upcoming",
            Component: UpcomingSessionsList,
          },
          {
            path: "session/:id",
            Component: SessionDetail,
          },
          {
            path: "requests",
            Component: MentorshipRequests,
          },
          {
            path: "request/:id",
            Component: RequestDetail,
          },
        ],
      },
      {
        path: "projects",
        Component: Projects,
      },
      {
        path: "projects/:id",
        Component: ProjectDetail,
      },
      {
        path: "courses",
        Component: Courses,
      },
      {
        path: "courses/:id",
        Component: CourseDetail,
      },
      {
        path: "admin",
        Component: AdminDashboard,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "5d-snapshot",
        Component: FiveDSnapshot,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);