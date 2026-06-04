/* ─── Shared Course Data ─────────────────────────────────────────── */

export interface CourseSession {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: string;
  status: "completed" | "upcoming" | "locked";
  materials: string[];
}

export interface CourseReview {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  instructor: string;
  instructorTitle: string;
  instructorAvatar: string;
  instructorBio: string;
  category: Category;
  level: "Beginner" | "Intermediate" | "Advanced";
  totalSessions: number;
  completedSessions: number;
  enrolledStudents: number;
  maxStudents: number;
  rating: number;
  reviewCount: number;
  price: number;
  pricingModel: string;
  nextSession: string;
  duration: string;
  tags: string[];
  featured: boolean;
  enrolled: boolean;
  progress: number;
  gradient: string;
  iconBg: string;
  learningOutcomes: string[];
  prerequisites: string[];
  sessions: CourseSession[];
  reviews: CourseReview[];
}

export type Category = "all" | "technology" | "finance" | "leadership" | "healthcare" | "career";

export const categories: { id: Category; label: string; count: number }[] = [
  { id: "all", label: "All Courses", count: 8 },
  { id: "technology", label: "Technology", count: 3 },
  { id: "finance", label: "Finance", count: 2 },
  { id: "leadership", label: "Leadership", count: 1 },
  { id: "healthcare", label: "Healthcare", count: 1 },
  { id: "career", label: "Career Growth", count: 1 },
];

export const courses: Course[] = [
  {
    id: 1,
    title: "Advanced React Patterns & Architecture",
    subtitle: "Master scalable frontend patterns used at top tech companies",
    description:
      "Go beyond the basics. This course covers advanced React patterns — render props, compound components, custom hooks, and performance optimization — that power production systems at companies like Google, Meta, and Stripe. Each session includes live coding, architectural reviews, and take-home challenges designed to accelerate your growth from mid-level to senior engineer.",
    instructor: "Sarah Kim",
    instructorTitle: "Staff Engineer · ex-Google",
    instructorAvatar: "SK",
    instructorBio:
      "Sarah spent 8 years at Google building React-based products serving billions of users. She specializes in frontend architecture, performance optimization, and developer experience tooling. Previously tech lead on Google Cloud Console.",
    category: "technology",
    level: "Advanced",
    totalSessions: 8,
    completedSessions: 6,
    enrolledStudents: 24,
    maxStudents: 30,
    rating: 4.9,
    reviewCount: 18,
    price: 75,
    pricingModel: "per session",
    nextSession: "Tomorrow, 2:00 PM",
    duration: "8 weeks",
    tags: ["React", "TypeScript", "System Design"],
    featured: true,
    enrolled: true,
    progress: 75,
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    iconBg: "bg-blue-500",
    learningOutcomes: [
      "Architect scalable React applications using advanced patterns",
      "Implement render props, HOCs, and compound component APIs",
      "Build custom hooks for complex state management",
      "Optimize performance with React.memo, useMemo, and code splitting",
      "Design component libraries used across large organizations",
      "Apply real-world architectural decisions from FAANG-scale systems",
    ],
    prerequisites: [
      "Solid understanding of React fundamentals (hooks, state, effects)",
      "Working knowledge of TypeScript",
      "1+ year professional React experience",
    ],
    sessions: [
      { id: 1, title: "Introduction to Render Props", description: "Understand the render prop pattern and when to use it over alternatives.", date: "May 6, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Code Repo", "Recording"] },
      { id: 2, title: "Higher-Order Components Deep Dive", description: "HOC composition patterns, prop forwarding, and debugging techniques.", date: "May 13, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Code Repo", "Recording"] },
      { id: 3, title: "Compound Components Pattern", description: "Build flexible, declarative APIs using React.Children and context.", date: "May 20, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Code Repo", "Recording"] },
      { id: 4, title: "Custom Hooks Mastery", description: "Extract and compose custom hooks for reusable logic across components.", date: "May 27, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Code Repo", "Recording"] },
      { id: 5, title: "Context & State Management", description: "When to use context vs. external stores; performance implications.", date: "Jun 3, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Code Repo", "Recording"] },
      { id: 6, title: "Performance Optimization", description: "React.memo, useMemo, code splitting, and profiler-driven optimizations.", date: "Jun 10, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Code Repo", "Recording"] },
      { id: 7, title: "Real-World Architecture", description: "Case study: building a design system from scratch for a large SaaS product.", date: "Jun 17, 2026", duration: "90 min", status: "upcoming", materials: [] },
      { id: 8, title: "Final Project Review", description: "Present your capstone project; receive feedback from Sarah and peers.", date: "Jun 24, 2026", duration: "120 min", status: "upcoming", materials: [] },
    ],
    reviews: [
      { id: 1, name: "Alex Thompson", avatar: "AT", rating: 5, date: "Jun 1, 2026", comment: "Best React course I've ever taken. Sarah explains complex patterns with crystal clarity. The capstone project alone is worth the price." },
      { id: 2, name: "Jessica Martinez", avatar: "JM", rating: 5, date: "May 28, 2026", comment: "Went from struggling with HOCs to building our company's component library. Life-changing." },
      { id: 3, name: "Ryan Chen", avatar: "RC", rating: 4, date: "May 20, 2026", comment: "Great depth. Would love more on testing patterns for these advanced components." },
    ],
  },
  {
    id: 2,
    title: "Machine Learning for Product Engineers",
    subtitle: "Practical ML — from model training to production deployment",
    description:
      "Bridge the gap between ML theory and production reality. This course is designed for software engineers who want to integrate ML into real products — not just Jupyter notebooks. You'll build, train, deploy, and monitor ML models using industry-standard tools like TensorFlow, MLflow, and Kubernetes.",
    instructor: "Sarah Kim",
    instructorTitle: "Staff Engineer · ML Platform",
    instructorAvatar: "SK",
    instructorBio:
      "Sarah led ML infrastructure at Google, building platforms that served millions of model predictions per second. She is passionate about making ML accessible to product engineers.",
    category: "technology",
    level: "Intermediate",
    totalSessions: 10,
    completedSessions: 3,
    enrolledStudents: 18,
    maxStudents: 25,
    rating: 4.8,
    reviewCount: 14,
    price: 599,
    pricingModel: "full course",
    nextSession: "Wednesday, 4:00 PM",
    duration: "10 weeks",
    tags: ["Python", "TensorFlow", "MLOps"],
    featured: false,
    enrolled: true,
    progress: 30,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    iconBg: "bg-emerald-500",
    learningOutcomes: [
      "Train and evaluate ML models using TensorFlow and scikit-learn",
      "Deploy models to production with Docker and Kubernetes",
      "Build ML pipelines with feature stores and experiment tracking",
      "Monitor model drift and implement automated retraining",
      "Integrate ML predictions into web applications via REST APIs",
    ],
    prerequisites: [
      "Python programming proficiency",
      "Basic understanding of statistics and linear algebra",
      "Familiarity with REST APIs and web services",
    ],
    sessions: [
      { id: 1, title: "ML Fundamentals Refresher", description: "Supervised vs unsupervised, bias-variance, model selection.", date: "May 7, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Notebook", "Recording"] },
      { id: 2, title: "Data Pipelines & Feature Engineering", description: "Building robust data pipelines for ML with pandas and Spark.", date: "May 14, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Notebook", "Recording"] },
      { id: 3, title: "Model Training at Scale", description: "Distributed training, hyperparameter tuning, experiment tracking.", date: "May 21, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Notebook", "Recording"] },
      { id: 4, title: "Deep Learning with TensorFlow", description: "CNNs, RNNs, transformers — when and how to use each architecture.", date: "Jun 4, 2026", duration: "90 min", status: "upcoming", materials: [] },
      { id: 5, title: "Model Serving & APIs", description: "Deploy models behind REST APIs with FastAPI and TF Serving.", date: "Jun 11, 2026", duration: "90 min", status: "upcoming", materials: [] },
      { id: 6, title: "MLOps & CI/CD", description: "Automate the ML lifecycle with MLflow, DVC, and GitHub Actions.", date: "Jun 18, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 7, title: "Monitoring & Drift Detection", description: "Track model performance in production and detect data drift.", date: "Jun 25, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 8, title: "A/B Testing for ML", description: "Design experiments to measure the impact of ML features.", date: "Jul 2, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 9, title: "Edge Cases & Fairness", description: "Handle edge cases, ensure model fairness, and reduce bias.", date: "Jul 9, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 10, title: "Capstone: End-to-End ML System", description: "Build and present a complete ML system from data to deployment.", date: "Jul 16, 2026", duration: "120 min", status: "locked", materials: [] },
    ],
    reviews: [
      { id: 1, name: "David Park", avatar: "DP", rating: 5, date: "May 25, 2026", comment: "Finally a course that bridges the gap between notebooks and production. Exactly what I needed." },
      { id: 2, name: "Sarah Chen", avatar: "SC", rating: 5, date: "May 22, 2026", comment: "The feature engineering session alone saved me weeks of trial and error at work." },
    ],
  },
  {
    id: 3,
    title: "Breaking Into Private Equity",
    subtitle: "Complete guide from deal sourcing to portfolio management",
    description:
      "A comprehensive program designed for finance professionals looking to transition into private equity. Covers the full PE lifecycle — from deal sourcing and due diligence to LBO modeling, portfolio management, and exit strategies. Learn from a Goldman Sachs VP with 12+ years of deal experience.",
    instructor: "David Wong",
    instructorTitle: "VP · Goldman Sachs",
    instructorAvatar: "DW",
    instructorBio:
      "David is a Vice President at Goldman Sachs with 12 years in investment banking and private equity. He has led over $3B in transactions across technology, healthcare, and consumer sectors.",
    category: "finance",
    level: "Intermediate",
    totalSessions: 12,
    completedSessions: 0,
    enrolledStudents: 15,
    maxStudents: 20,
    rating: 4.7,
    reviewCount: 11,
    price: 450,
    pricingModel: "per phase",
    nextSession: "Starts Jun 16",
    duration: "12 weeks",
    tags: ["PE", "LBO Modeling", "Due Diligence"],
    featured: true,
    enrolled: false,
    progress: 0,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    iconBg: "bg-amber-500",
    learningOutcomes: [
      "Understand the PE fund lifecycle from fundraising to exit",
      "Build LBO models from scratch in Excel",
      "Conduct due diligence on target companies",
      "Evaluate deal structures and negotiate term sheets",
      "Develop portfolio monitoring and value creation plans",
      "Prepare for PE interview case studies",
    ],
    prerequisites: [
      "Foundational finance knowledge (accounting, valuation basics)",
      "Proficiency in Excel / Google Sheets",
      "1+ year experience in finance, consulting, or related field",
    ],
    sessions: [
      { id: 1, title: "PE Industry Overview", description: "Fund structures, GP/LP dynamics, and the current PE landscape.", date: "Jun 16, 2026", duration: "90 min", status: "upcoming", materials: [] },
      { id: 2, title: "Deal Sourcing & Screening", description: "How PE firms find deals, screening criteria, and pipeline management.", date: "Jun 23, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 3, title: "LBO Modeling I — Foundations", description: "Build a basic LBO model: sources & uses, debt schedules, returns.", date: "Jun 30, 2026", duration: "120 min", status: "locked", materials: [] },
      { id: 4, title: "LBO Modeling II — Advanced", description: "Add-on acquisitions, management rollover, PIK instruments.", date: "Jul 7, 2026", duration: "120 min", status: "locked", materials: [] },
      { id: 5, title: "Due Diligence Framework", description: "Commercial, financial, legal, and operational DD processes.", date: "Jul 14, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 6, title: "Valuation Methods in PE", description: "Comparable companies, precedent transactions, DCF in a PE context.", date: "Jul 21, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 7, title: "Deal Structuring & Negotiation", description: "Term sheets, earn-outs, reps & warranties, indemnification.", date: "Jul 28, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 8, title: "Portfolio Management", description: "100-day plans, operational improvement, reporting to LPs.", date: "Aug 4, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 9, title: "Value Creation Strategies", description: "Revenue growth, margin expansion, and multiple expansion levers.", date: "Aug 11, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 10, title: "Exit Strategies", description: "IPO, strategic sale, secondary buyout — timing and execution.", date: "Aug 18, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 11, title: "PE Interview Prep", description: "Case studies, technical questions, and behavioral interview tips.", date: "Aug 25, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 12, title: "Final Case Study Presentation", description: "Present a full PE investment thesis to a panel.", date: "Sep 1, 2026", duration: "120 min", status: "locked", materials: [] },
    ],
    reviews: [
      { id: 1, name: "James Liu", avatar: "JL", rating: 5, date: "Mar 15, 2026", comment: "David's real-world deal experience makes this course stand out. The LBO modeling sessions are world-class." },
      { id: 2, name: "Priya Sharma", avatar: "PS", rating: 4, date: "Mar 10, 2026", comment: "Excellent content. Would love even more time on the negotiation module." },
    ],
  },
  {
    id: 4,
    title: "System Design Mastery",
    subtitle: "Design scalable systems — from basics to real-world architectures",
    description:
      "Master the art of system design for technical interviews and real-world engineering. Each session walks through a complete system — from requirements gathering to detailed architecture — covering load balancers, databases, caching, message queues, and more. Includes mock interview practice with feedback.",
    instructor: "Sarah Kim",
    instructorTitle: "Staff Engineer · ex-Google",
    instructorAvatar: "SK",
    instructorBio:
      "Sarah spent 8 years at Google building React-based products serving billions of users. She specializes in frontend architecture, performance optimization, and developer experience tooling.",
    category: "technology",
    level: "Advanced",
    totalSessions: 12,
    completedSessions: 9,
    enrolledStudents: 15,
    maxStudents: 20,
    rating: 4.9,
    reviewCount: 13,
    price: 85,
    pricingModel: "per session",
    nextSession: "Friday, 11:00 AM",
    duration: "12 weeks",
    tags: ["Distributed Systems", "Scalability", "Architecture"],
    featured: false,
    enrolled: true,
    progress: 75,
    gradient: "from-purple-600 via-fuchsia-600 to-pink-600",
    iconBg: "bg-purple-500",
    learningOutcomes: [
      "Design systems that scale to millions of users",
      "Apply the right database for the right workload (SQL, NoSQL, time-series)",
      "Implement caching strategies, CDNs, and load balancing",
      "Design real-time systems with WebSockets and message queues",
      "Navigate system design interviews with structured frameworks",
      "Analyze trade-offs: consistency vs availability, latency vs throughput",
    ],
    prerequisites: [
      "2+ years software engineering experience",
      "Basic understanding of databases and networking",
      "Familiarity with at least one backend language (Python, Go, Java, etc.)",
    ],
    sessions: [
      { id: 1, title: "System Design Framework", description: "A structured approach: requirements, estimation, API design, data model.", date: "Apr 3, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Whiteboard", "Recording"] },
      { id: 2, title: "Designing a URL Shortener", description: "Hash functions, database choices, read-heavy optimization.", date: "Apr 10, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Whiteboard", "Recording"] },
      { id: 3, title: "Designing a Chat System", description: "WebSockets, message ordering, presence, and offline handling.", date: "Apr 17, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Whiteboard", "Recording"] },
      { id: 4, title: "Designing a News Feed", description: "Fan-out strategies, ranking algorithms, and caching layers.", date: "Apr 24, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Whiteboard", "Recording"] },
      { id: 5, title: "Designing a Rate Limiter", description: "Token bucket, sliding window, distributed rate limiting.", date: "May 1, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Whiteboard", "Recording"] },
      { id: 6, title: "Designing a Search Engine", description: "Inverted indexes, relevance ranking, query understanding.", date: "May 8, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Whiteboard", "Recording"] },
      { id: 7, title: "Designing a Video Streaming Platform", description: "Video encoding, CDN architecture, adaptive bitrate streaming.", date: "May 15, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Whiteboard", "Recording"] },
      { id: 8, title: "Designing a Distributed Cache", description: "Consistent hashing, replication, eviction policies.", date: "May 22, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Whiteboard", "Recording"] },
      { id: 9, title: "Designing a Payment System", description: "Idempotency, double-entry ledger, PCI compliance.", date: "May 29, 2026", duration: "90 min", status: "completed", materials: ["Slides", "Whiteboard", "Recording"] },
      { id: 10, title: "Designing a Notification System", description: "Multi-channel delivery, priority queues, templating.", date: "Jun 5, 2026", duration: "90 min", status: "upcoming", materials: [] },
      { id: 11, title: "Mock Interview Practice I", description: "Timed system design mock with detailed feedback.", date: "Jun 12, 2026", duration: "120 min", status: "upcoming", materials: [] },
      { id: 12, title: "Mock Interview Practice II", description: "Advanced mock focusing on deep dives and trade-off analysis.", date: "Jun 19, 2026", duration: "120 min", status: "upcoming", materials: [] },
    ],
    reviews: [
      { id: 1, name: "Michael Rodriguez", avatar: "MR", rating: 5, date: "May 30, 2026", comment: "This course directly led to my Staff Engineer promotion. The mock interviews are incredibly realistic." },
      { id: 2, name: "Aisha Pattel", avatar: "AP", rating: 5, date: "May 25, 2026", comment: "Sarah's ability to break down complex systems into digestible components is unmatched." },
      { id: 3, name: "Tom Wilson", avatar: "TW", rating: 5, date: "May 18, 2026", comment: "Got my dream job at Stripe after this course. The payment system design session was particularly relevant." },
    ],
  },
  {
    id: 5,
    title: "Telemedicine Architecture Deep Dive",
    subtitle: "Build HIPAA-compliant telehealth platforms from the ground up",
    description:
      "Dive deep into the technical architecture of modern telemedicine platforms. Learn to build HIPAA-compliant, real-time video consultation systems with secure data handling, EHR integrations, and scalable infrastructure. Ideal for engineers building in the healthcare space.",
    instructor: "Elena Ross",
    instructorTitle: "CTO · HealthTech Startup",
    instructorAvatar: "ER",
    instructorBio:
      "Elena is the CTO of a YC-backed telehealth startup. Previously led engineering at two digital health companies, building platforms used by 500+ clinics and 1M+ patient interactions.",
    category: "healthcare",
    level: "Advanced",
    totalSessions: 6,
    completedSessions: 0,
    enrolledStudents: 8,
    maxStudents: 15,
    rating: 4.6,
    reviewCount: 6,
    price: 120,
    pricingModel: "per session",
    nextSession: "Starts Jun 23",
    duration: "6 weeks",
    tags: ["HIPAA", "WebRTC", "Cloud Architecture"],
    featured: false,
    enrolled: false,
    progress: 0,
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    iconBg: "bg-rose-500",
    learningOutcomes: [
      "Architect HIPAA-compliant systems with proper encryption and access controls",
      "Implement real-time video consultations using WebRTC",
      "Integrate with EHR/EMR systems via FHIR APIs",
      "Design fault-tolerant infrastructure for healthcare workloads",
      "Navigate regulatory requirements (HIPAA, HITECH, state laws)",
    ],
    prerequisites: [
      "2+ years backend engineering experience",
      "Basic understanding of cloud infrastructure (AWS/GCP)",
      "Interest in healthcare technology (no clinical background needed)",
    ],
    sessions: [
      { id: 1, title: "Healthcare Tech Landscape", description: "Market overview, regulatory environment, key technology stacks.", date: "Jun 23, 2026", duration: "90 min", status: "upcoming", materials: [] },
      { id: 2, title: "HIPAA Compliance for Engineers", description: "PHI handling, encryption requirements, BAAs, audit logging.", date: "Jun 30, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 3, title: "WebRTC Video Architecture", description: "Peer-to-peer vs SFU, TURN/STUN servers, recording & storage.", date: "Jul 7, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 4, title: "EHR Integration & FHIR APIs", description: "Connecting to Epic, Cerner; SMART on FHIR authorization.", date: "Jul 14, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 5, title: "Scalable Infrastructure", description: "Multi-region deployment, disaster recovery, and load testing.", date: "Jul 21, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 6, title: "Capstone: Design a Telehealth Platform", description: "End-to-end architecture review with live feedback.", date: "Jul 28, 2026", duration: "120 min", status: "locked", materials: [] },
    ],
    reviews: [
      { id: 1, name: "Nina Patel", avatar: "NP", rating: 5, date: "Apr 10, 2026", comment: "Elena's real-world startup experience makes every session incredibly practical." },
    ],
  },
  {
    id: 6,
    title: "Financial Modeling & Valuation",
    subtitle: "Build DCF, LBO, and M&A models used by top investment banks",
    description:
      "Learn to build the financial models that drive billion-dollar decisions on Wall Street. This hands-on course walks you through DCF analysis, comparable company analysis, precedent transactions, LBO modeling, and M&A accretion/dilution. Every session includes live Excel walkthroughs.",
    instructor: "David Wong",
    instructorTitle: "VP · Goldman Sachs",
    instructorAvatar: "DW",
    instructorBio:
      "David is a Vice President at Goldman Sachs with 12 years in investment banking and private equity. He has led over $3B in transactions across technology, healthcare, and consumer sectors.",
    category: "finance",
    level: "Beginner",
    totalSessions: 8,
    completedSessions: 0,
    enrolledStudents: 22,
    maxStudents: 30,
    rating: 4.8,
    reviewCount: 20,
    price: 499,
    pricingModel: "full course",
    nextSession: "Starts Jul 7",
    duration: "8 weeks",
    tags: ["Excel", "DCF", "Valuation"],
    featured: true,
    enrolled: false,
    progress: 0,
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    iconBg: "bg-sky-500",
    learningOutcomes: [
      "Build a 3-statement financial model from scratch",
      "Perform DCF analysis with sensitivity tables",
      "Run comparable company and precedent transaction analyses",
      "Build an LBO model with debt schedules and returns analysis",
      "Model M&A transactions including accretion/dilution analysis",
      "Present investment recommendations to a panel",
    ],
    prerequisites: [
      "Basic understanding of financial statements (income, balance sheet, cash flow)",
      "Intermediate Excel proficiency",
      "No prior modeling experience required",
    ],
    sessions: [
      { id: 1, title: "Financial Statements Deep Dive", description: "Income statement, balance sheet, cash flow — the building blocks.", date: "Jul 7, 2026", duration: "90 min", status: "upcoming", materials: [] },
      { id: 2, title: "3-Statement Model", description: "Link the three statements and build projection assumptions.", date: "Jul 14, 2026", duration: "120 min", status: "locked", materials: [] },
      { id: 3, title: "DCF Analysis", description: "WACC, terminal value, enterprise value to equity bridge.", date: "Jul 21, 2026", duration: "120 min", status: "locked", materials: [] },
      { id: 4, title: "Comparable Companies", description: "Select peer groups, calculate multiples, derive implied valuations.", date: "Jul 28, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 5, title: "Precedent Transactions", description: "Analyze historical M&A deals and derive transaction multiples.", date: "Aug 4, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 6, title: "LBO Modeling", description: "Sources & uses, debt schedules, IRR and MOIC calculations.", date: "Aug 11, 2026", duration: "120 min", status: "locked", materials: [] },
      { id: 7, title: "M&A Accretion/Dilution", description: "Model stock vs. cash deals, synergies, and EPS impact.", date: "Aug 18, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 8, title: "Investment Recommendation", description: "Present a buy-side pitch to a mock investment committee.", date: "Aug 25, 2026", duration: "120 min", status: "locked", materials: [] },
    ],
    reviews: [
      { id: 1, name: "Chris Tang", avatar: "CT", rating: 5, date: "May 5, 2026", comment: "Went from zero to being able to build a full LBO model. David is an incredible teacher." },
      { id: 2, name: "Rachel Kim", avatar: "RK", rating: 5, date: "Apr 28, 2026", comment: "The live Excel walkthroughs are incredibly valuable. You can follow along in real time." },
      { id: 3, name: "Omar Hassan", avatar: "OH", rating: 4, date: "Apr 20, 2026", comment: "Great course for beginners. The pacing is perfect and David is very patient with questions." },
    ],
  },
  {
    id: 7,
    title: "Engineering Leadership Masterclass",
    subtitle: "Transition from IC to manager — frameworks for leading technical teams",
    description:
      "Making the leap from individual contributor to engineering manager is one of the most challenging career transitions. This course provides battle-tested frameworks for 1:1s, performance reviews, team building, technical strategy, and navigating organizational politics — all from someone who's made the journey.",
    instructor: "Sarah Kim",
    instructorTitle: "Staff Engineer · ex-Google",
    instructorAvatar: "SK",
    instructorBio:
      "Sarah spent 8 years at Google, transitioning from senior engineer to tech lead managing a team of 15. She now mentors engineering leaders across the industry.",
    category: "leadership",
    level: "Intermediate",
    totalSessions: 6,
    completedSessions: 0,
    enrolledStudents: 12,
    maxStudents: 15,
    rating: 5.0,
    reviewCount: 9,
    price: 95,
    pricingModel: "per session",
    nextSession: "Starts Jun 30",
    duration: "6 weeks",
    tags: ["Management", "1:1s", "Team Building"],
    featured: false,
    enrolled: false,
    progress: 0,
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    iconBg: "bg-violet-500",
    learningOutcomes: [
      "Run effective 1:1s that build trust and uncover blockers",
      "Write performance reviews that drive growth",
      "Build and scale engineering teams through hiring and onboarding",
      "Set technical strategy and communicate it to stakeholders",
      "Navigate organizational politics and influence without authority",
      "Balance hands-on coding with management responsibilities",
    ],
    prerequisites: [
      "3+ years software engineering experience",
      "Currently in, or preparing for, a leadership role",
      "Desire to grow as a people leader (not just a tech lead)",
    ],
    sessions: [
      { id: 1, title: "The IC-to-Manager Transition", description: "Mindset shifts, common traps, and building your management identity.", date: "Jun 30, 2026", duration: "90 min", status: "upcoming", materials: [] },
      { id: 2, title: "Mastering 1:1s", description: "Templates, cadences, and techniques for productive 1:1 conversations.", date: "Jul 7, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 3, title: "Performance Management", description: "Goal setting, feedback frameworks, calibration, and difficult conversations.", date: "Jul 14, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 4, title: "Hiring & Team Building", description: "Interview design, rubrics, onboarding, and team culture.", date: "Jul 21, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 5, title: "Technical Strategy & Roadmaps", description: "Aligning engineering work with business goals and communicating upward.", date: "Jul 28, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 6, title: "Influence & Organizational Dynamics", description: "Stakeholder management, cross-functional collaboration, managing up.", date: "Aug 4, 2026", duration: "90 min", status: "locked", materials: [] },
    ],
    reviews: [
      { id: 1, name: "Kevin Li", avatar: "KL", rating: 5, date: "May 15, 2026", comment: "Sarah's 1:1 framework completely transformed my relationships with direct reports." },
      { id: 2, name: "Emma Watson", avatar: "EW", rating: 5, date: "May 10, 2026", comment: "I wish I had this course when I first became a manager. Would have avoided so many mistakes." },
    ],
  },
  {
    id: 8,
    title: "Career Transition Blueprint",
    subtitle: "Navigate career pivots with confidence — strategy, networking & personal branding",
    description:
      "Whether you're switching industries, roles, or starting fresh, this course gives you a proven system for making career transitions. Covers self-assessment, market research, resume optimization, networking strategies, interview preparation, and personal branding — with personalized coaching.",
    instructor: "Elena Ross",
    instructorTitle: "Career Coach · 15+ yrs",
    instructorAvatar: "ER",
    instructorBio:
      "Elena has helped 500+ professionals navigate career transitions across tech, healthcare, finance, and consulting. She combines coaching frameworks with real hiring manager insights.",
    category: "career",
    level: "Beginner",
    totalSessions: 5,
    completedSessions: 0,
    enrolledStudents: 28,
    maxStudents: 40,
    rating: 4.7,
    reviewCount: 24,
    price: 299,
    pricingModel: "full course",
    nextSession: "Starts Jun 18",
    duration: "5 weeks",
    tags: ["Networking", "Resume", "Personal Brand"],
    featured: false,
    enrolled: false,
    progress: 0,
    gradient: "from-teal-500 via-emerald-500 to-green-500",
    iconBg: "bg-teal-500",
    learningOutcomes: [
      "Identify transferable skills and target roles that match your strengths",
      "Build a personal brand that attracts recruiters and hiring managers",
      "Optimize your resume, LinkedIn, and portfolio for career pivots",
      "Develop a networking strategy that opens doors to hidden opportunities",
      "Prepare for behavioral and case interviews in your target industry",
    ],
    prerequisites: [
      "No specific prerequisites — open to all career stages",
      "A willingness to invest time in self-reflection and action steps",
    ],
    sessions: [
      { id: 1, title: "Self-Assessment & Target Setting", description: "Skills audit, values exploration, and defining your transition direction.", date: "Jun 18, 2026", duration: "90 min", status: "upcoming", materials: [] },
      { id: 2, title: "Resume & LinkedIn Optimization", description: "Rewrite your resume and profile for your target role.", date: "Jun 25, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 3, title: "Personal Branding & Portfolio", description: "Build a compelling personal brand and online presence.", date: "Jul 2, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 4, title: "Networking & Informational Interviews", description: "Strategies for reaching out, building relationships, and asking for referrals.", date: "Jul 9, 2026", duration: "90 min", status: "locked", materials: [] },
      { id: 5, title: "Interview Mastery & Offer Negotiation", description: "Behavioral interviews, case studies, and negotiating your best offer.", date: "Jul 16, 2026", duration: "90 min", status: "locked", materials: [] },
    ],
    reviews: [
      { id: 1, name: "Lisa Chang", avatar: "LC", rating: 5, date: "Apr 20, 2026", comment: "Elena helped me pivot from teaching to product management in 3 months. Her networking framework is gold." },
      { id: 2, name: "Mark Thompson", avatar: "MT", rating: 5, date: "Apr 15, 2026", comment: "The resume session alone was worth the entire course price. Got 3x more callbacks after rewriting." },
      { id: 3, name: "Fatima Al-Rashid", avatar: "FA", rating: 4, date: "Apr 8, 2026", comment: "Great for people who feel stuck. Elena creates a safe space to explore career possibilities." },
    ],
  },
];

export function getCourseById(id: number): Course | undefined {
  return courses.find((c) => c.id === id);
}
