import { Link } from "react-router";
import { ArrowLeft, Users, Calendar, DollarSign, TrendingUp, CheckCircle, Clock, FileText, Award, Percent, Share2, Link as LinkIcon } from "lucide-react";

const courseData = {
  id: 1,
  title: "Advanced React Patterns",
  instructor: "Sarah Johnson",
  description: "Master advanced React patterns including render props, HOCs, compound components, and custom hooks for building scalable applications",
  enrolledStudents: 24,
  totalSessions: 8,
  completedSessions: 6,
  pricingModel: "Per Session",
  price: 75,
  revenue: 3200,
  completionRate: 85,
  attendanceRate: 92,
  enrollmentLink: "https://phxnorth.com/courses/advanced-react-patterns",
  sessions: [
    { 
      id: 1, 
      title: "Introduction to Render Props", 
      date: "Jan 10, 2026", 
      status: "Completed",
      attendance: 23,
      assignments: { submitted: 22, total: 24 },
      transcript: true,
    },
    { 
      id: 2, 
      title: "Higher-Order Components Deep Dive", 
      date: "Jan 17, 2026", 
      status: "Completed",
      attendance: 24,
      assignments: { submitted: 21, total: 24 },
      transcript: true,
    },
    { 
      id: 3, 
      title: "Compound Components Pattern", 
      date: "Jan 24, 2026", 
      status: "Completed",
      attendance: 22,
      assignments: { submitted: 20, total: 24 },
      transcript: true,
    },
    { 
      id: 4, 
      title: "Custom Hooks Mastery", 
      date: "Jan 31, 2026", 
      status: "Completed",
      attendance: 23,
      assignments: { submitted: 23, total: 24 },
      transcript: true,
    },
    { 
      id: 5, 
      title: "Context & State Management", 
      date: "Feb 7, 2026", 
      status: "Completed",
      attendance: 21,
      assignments: { submitted: 19, total: 24 },
      transcript: true,
    },
    { 
      id: 6, 
      title: "Performance Optimization", 
      date: "Feb 14, 2026", 
      status: "Completed",
      attendance: 22,
      assignments: { submitted: 20, total: 24 },
      transcript: true,
    },
    { 
      id: 7, 
      title: "Real-World Architecture", 
      date: "Feb 21, 2026", 
      status: "Upcoming",
      attendance: 0,
      assignments: { submitted: 0, total: 24 },
      transcript: false,
    },
    { 
      id: 8, 
      title: "Final Project Review", 
      date: "Feb 28, 2026", 
      status: "Upcoming",
      attendance: 0,
      assignments: { submitted: 0, total: 24 },
      transcript: false,
    },
  ],
  students: [
    { id: 1, name: "Alex Thompson", attendance: 8, assignmentsCompleted: 6, progress: 90 },
    { id: 2, name: "Jessica Martinez", attendance: 8, assignmentsCompleted: 6, progress: 85 },
    { id: 3, name: "Ryan Chen", attendance: 7, assignmentsCompleted: 5, progress: 75 },
    { id: 4, name: "Sarah Kim", attendance: 8, assignmentsCompleted: 6, progress: 95 },
    { id: 5, name: "David Park", attendance: 6, assignmentsCompleted: 5, progress: 70 },
  ],
  discounts: [
    { code: "EARLY25", percentage: 25, uses: 8, maxUses: 10, active: true },
    { code: "BUNDLE50", percentage: 50, uses: 3, maxUses: 5, active: true },
  ],
};

export function CourseDetail() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link to="/app/courses" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseData.title}</h1>
            <p className="text-gray-600 mb-4">{courseData.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Instructor:</span>
                <span className="text-gray-900 font-medium">{courseData.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Pricing:</span>
                <span className="text-gray-900 font-medium">${courseData.price} {courseData.pricingModel}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Sessions:</span>
                <span className="text-gray-900 font-medium">{courseData.completedSessions}/{courseData.totalSessions} completed</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="bg-[#0A2463] text-white px-4 py-2 rounded-lg hover:bg-[#0A2463]/90 transition-colors">
              Edit Course
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Enrolled Students</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{courseData.enrolledStudents}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">${courseData.revenue.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{courseData.completionRate}%</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Attendance Rate</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{courseData.attendanceRate}%</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Sessions Done</span>
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{courseData.completedSessions}/{courseData.totalSessions}</div>
        </div>
      </div>

      {/* Shareable Course Card & Enrollment Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sessions & Attendance Tracking</h2>
          <div className="space-y-3">
            {courseData.sessions.map((session) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Enrollment Link */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrollment Link</h2>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Share this link:</span>
              </div>
              <p className="text-sm text-[#0A2463] break-all">{courseData.enrollmentLink}</p>
            </div>
            <button className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Copy Link
            </button>
          </div>

          {/* Course Landing Preview */}
          <div className="bg-gradient-to-br from-[#0A2463] to-blue-700 rounded-xl p-6 text-white">
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wide mb-2 opacity-80">Course Preview</div>
              <h3 className="text-lg font-semibold">{courseData.title}</h3>
              <p className="text-sm opacity-90 mt-2">{courseData.description}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="opacity-80">Duration</span>
                <span className="font-semibold">{courseData.totalSessions} sessions</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-80">Price</span>
                <span className="font-semibold">${courseData.price}/{courseData.pricingModel.split(' ')[1]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-80">Students</span>
                <span className="font-semibold">{courseData.enrolledStudents} enrolled</span>
              </div>
            </div>
            <button className="w-full bg-white text-[#0A2463] px-4 py-2 rounded-lg mt-4 font-semibold hover:bg-gray-100 transition-colors">
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Student Management & Assignment Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Enrolled Students</h2>
          <div className="space-y-3">
            {courseData.students.map((student) => (
              <StudentRow key={student.id} student={student} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Discount Management</h2>
            <button className="text-sm text-[#0A2463] hover:underline flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Add Discount
            </button>
          </div>
          <div className="space-y-4">
            {courseData.discounts.map((discount, idx) => (
              <DiscountCard key={idx} discount={discount} />
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Model Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Model Configuration</h2>
        <div className="grid grid-cols-3 gap-4">
          <PricingOption 
            title="Per Session"
            description="Students pay for each individual session"
            price="$75"
            selected={courseData.pricingModel === "Per Session"}
          />
          <PricingOption 
            title="Per Phase"
            description="Group sessions into phases with bundled pricing"
            price="$450"
            selected={courseData.pricingModel === "Per Phase"}
          />
          <PricingOption 
            title="Per Course"
            description="One-time payment for entire course access"
            price="$599"
            selected={courseData.pricingModel === "Per Course"}
          />
        </div>
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: typeof courseData.sessions[0] }) {
  const isCompleted = session.status === "Completed";
  
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isCompleted ? 'bg-green-50' : 'bg-gray-50'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Clock className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{session.title}</h4>
          <p className="text-sm text-gray-600">{session.date}</p>
        </div>
      </div>
      {isCompleted && (
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-gray-500 mb-1">Attendance</div>
            <div className="font-semibold text-gray-900">{session.attendance}/{courseData.enrolledStudents}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 mb-1">Assignments</div>
            <div className="font-semibold text-gray-900">{session.assignments.submitted}/{session.assignments.total}</div>
          </div>
          {session.transcript && (
            <FileText className="w-5 h-5 text-gray-400" />
          )}
        </div>
      )}
    </div>
  );
}

function StudentRow({ student }: { student: typeof courseData.students[0] }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#0A2463] text-white rounded-full flex items-center justify-center">
          {student.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{student.name}</h4>
          <p className="text-sm text-gray-600">{student.attendance}/{courseData.completedSessions} sessions attended</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm text-gray-500">Progress</div>
          <div className="font-semibold text-gray-900">{student.progress}%</div>
        </div>
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full" 
            style={{ width: `${student.progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}

function DiscountCard({ discount }: { discount: typeof courseData.discounts[0] }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-gray-900">{discount.code}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            discount.active ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
          }`}>
            {discount.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <span className="text-lg font-bold text-[#0A2463]">{discount.percentage}% OFF</span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Uses: {discount.uses}/{discount.maxUses}</span>
        <div className="w-24 bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ width: `${(discount.uses / discount.maxUses) * 100}%` }} 
          />
        </div>
      </div>
    </div>
  );
}

function PricingOption({ title, description, price, selected }: {
  title: string;
  description: string;
  price: string;
  selected: boolean;
}) {
  return (
    <div className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
      selected 
        ? 'border-[#0A2463] bg-blue-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {selected && (
          <CheckCircle className="w-5 h-5 text-[#0A2463]" />
        )}
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="text-2xl font-bold text-gray-900">{price}</div>
    </div>
  );
}