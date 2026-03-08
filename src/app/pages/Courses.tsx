import { Link } from "react-router";
import { Plus, Search, Filter, BookOpen, Users, TrendingUp, DollarSign } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    instructor: "Sarah Johnson",
    description: "Master advanced React patterns including render props, HOCs, compound components, and custom hooks",
    enrolledStudents: 24,
    totalSessions: 8,
    completedSessions: 6,
    pricingModel: "Per Session",
    price: 75,
    revenue: 3200,
    nextSession: "Tomorrow, 2:00 PM",
    completionRate: 85,
    attendanceRate: 92,
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Michael Chen",
    description: "Comprehensive introduction to ML algorithms, model training, and practical applications",
    enrolledStudents: 18,
    totalSessions: 10,
    completedSessions: 3,
    pricingModel: "Per Course",
    price: 599,
    revenue: 2400,
    nextSession: "Wednesday, 4:00 PM",
    completionRate: 72,
    attendanceRate: 88,
  },
  {
    id: 3,
    title: "System Design Mastery",
    instructor: "Sarah Johnson",
    description: "Learn to design scalable systems, from fundamentals to real-world architecture patterns",
    enrolledStudents: 15,
    totalSessions: 12,
    completedSessions: 9,
    pricingModel: "Per Phase",
    price: 450,
    revenue: 2800,
    nextSession: "Friday, 11:00 AM",
    completionRate: 90,
    attendanceRate: 95,
  },
];

export function Courses() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">Comprehensive learning programs with structured curriculum</p>
        </div>
        <button className="bg-[#0A2463] text-white px-6 py-3 rounded-lg hover:bg-[#0A2463]/90 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Courses</span>
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">6</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Students</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">57</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Completion</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">82%</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">$8.4K</div>
        </div>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: typeof courses[0] }) {
  return (
    <Link to={`/app/courses/${course.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
              <span className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
                {course.pricingModel}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{course.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Instructor:</span>
                <span className="text-gray-900 font-medium">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{course.enrolledStudents} students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{course.completedSessions}/{course.totalSessions} sessions</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Revenue</div>
            <div className="text-2xl font-bold text-green-600">${course.revenue.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">
              ${course.price}/{course.pricingModel.split(' ')[1].toLowerCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 pt-4 border-t border-gray-200">
          <div>
            <div className="text-sm text-gray-500 mb-2">Session Progress</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(course.completedSessions / course.totalSessions) * 100}%` }} 
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {Math.round((course.completedSessions / course.totalSessions) * 100)}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">Completion Rate</div>
            <div className="text-lg font-semibold text-gray-900">{course.completionRate}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">Attendance Rate</div>
            <div className="text-lg font-semibold text-gray-900">{course.attendanceRate}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">Next Session</div>
            <div className="text-sm font-semibold text-gray-900">{course.nextSession}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
