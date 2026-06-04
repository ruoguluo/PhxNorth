import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  BookOpen,
  Users,
  Clock,
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  TrendingUp,
  Zap,
  Filter,
  GraduationCap,
  BarChart3,
  Globe,
  Code,
  Briefcase,
  Heart,
  Award,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { courses, categories, type Course, type Category } from "../data/courses";

/* ─── Level Badge ────────────────────────────────────────────────── */

function LevelBadge({ level }: { level: Course["level"] }) {
  const styles = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
    Advanced: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[level]}`}>
      {level}
    </span>
  );
}

/* ─── Star Rating ────────────────────────────────────────────────── */

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-900">{rating}</span>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  );
}

/* ─── Featured Course Hero Card ──────────────────────────────────── */

function FeaturedCourseCard({ course }: { course: Course }) {
  return (
    <Link to={`/app/courses/${course.id}`} className="block group">
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${course.gradient} p-8 text-white shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.01]`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                Featured
              </span>
              <LevelBadge level={course.level} />
            </div>

            <h2 className="text-3xl font-bold mb-2 leading-tight">{course.title}</h2>
            <p className="text-white/85 text-base mb-5 leading-relaxed">{course.subtitle}</p>

            <div className="flex items-center gap-5 mb-6 text-sm text-white/80">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{course.totalSessions} sessions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{course.enrolledStudents}/{course.maxStudents}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-sm font-bold">
                {course.instructorAvatar}
              </div>
              <div>
                <div className="font-semibold text-sm">{course.instructor}</div>
                <div className="text-xs text-white/70">{course.instructorTitle}</div>
              </div>
            </div>
          </div>

          <div className="text-right ml-8 flex-shrink-0">
            <div className="text-4xl font-bold mb-1">
              ${course.price}
            </div>
            <div className="text-sm text-white/70 mb-6">{course.pricingModel}</div>
            <button className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2">
              {course.enrolled ? (
                <>
                  <Play className="w-4 h-4" />
                  Continue
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Enroll Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress bar for enrolled courses */}
        {course.enrolled && course.progress > 0 && (
          <div className="relative z-10 mt-6">
            <div className="flex justify-between text-xs text-white/70 mb-2">
              <span>{course.progress}% complete</span>
              <span>{course.completedSessions}/{course.totalSessions} sessions</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

/* ─── Course Card ────────────────────────────────────────────────── */

function CourseCard({ course }: { course: Course }) {
  const spotsLeft = course.maxStudents - course.enrolledStudents;
  const almostFull = spotsLeft <= 5;

  return (
    <Link to={`/app/courses/${course.id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5 h-full flex flex-col">
        {/* Gradient header strip */}
        <div className={`h-2 bg-gradient-to-r ${course.gradient}`} />

        <div className="p-6 flex-1 flex flex-col">
          {/* Top: Tags + Level */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LevelBadge level={course.level} />
              {almostFull && !course.enrolled && (
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">
                  {spotsLeft} spots left
                </span>
              )}
            </div>
            {course.enrolled && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Enrolled
              </span>
            )}
          </div>

          {/* Title + Description */}
          <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-[#0A2463] transition-colors leading-snug">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{course.subtitle}</p>

          {/* Instructor */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className={`w-8 h-8 rounded-full ${course.iconBg} text-white flex items-center justify-center text-xs font-bold`}>
              {course.instructorAvatar}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{course.instructor}</div>
              <div className="text-xs text-gray-500">{course.instructorTitle}</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Progress or Next Session */}
          {course.enrolled && course.progress > 0 ? (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{course.progress}% complete</span>
                <span>{course.completedSessions}/{course.totalSessions} sessions</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${course.gradient} transition-all duration-500`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.nextSession}</span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom: Stats + Price */}
          <div className="flex items-end justify-between pt-4 border-t border-gray-100">
            <div className="space-y-1.5">
              <StarRating rating={course.rating} count={course.reviewCount} />
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {course.enrolledStudents} enrolled
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.totalSessions} sessions
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">${course.price}</div>
              <div className="text-xs text-gray-500">{course.pricingModel}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */

export function Courses() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);

  const enrolledCourses = courses.filter((c) => c.enrolled);
  const featuredCourses = courses.filter((c) => c.featured && !c.enrolled);

  const filteredCourses = courses.filter((c) => {
    if (showEnrolledOnly && !c.enrolled) return false;
    if (activeCategory !== "all" && c.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.subtitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-gradient-to-br from-[#0A2463] to-indigo-600 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-500 text-sm">Structured learning programs led by expert mentors</p>
          </div>
        </div>
      </div>

      {/* ── My Enrolled Summary (if any) ── */}
      {enrolledCourses.length > 0 && (
        <div className="bg-gradient-to-r from-[#0A2463] to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-300" />
              <h2 className="text-lg font-semibold">My Learning</h2>
            </div>
            <button
              onClick={() => setShowEnrolledOnly(!showEnrolledOnly)}
              className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1"
            >
              {showEnrolledOnly ? "Show all courses" : "View enrolled only"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {enrolledCourses.map((c) => (
              <Link
                key={c.id}
                to={`/app/courses/${c.id}`}
                className="bg-white/10 backdrop-blur rounded-xl p-4 hover:bg-white/15 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold truncate pr-2">{c.title}</h3>
                  <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors flex-shrink-0" />
                </div>
                <div className="flex justify-between text-xs text-white/70 mb-2">
                  <span>{c.progress}% complete</span>
                  <span>{c.completedSessions}/{c.totalSessions}</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Featured Courses (carousel) ── */}
      {!showEnrolledOnly && featuredCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredCourses.slice(0, 2).map((c) => (
              <FeaturedCourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}

      {/* ── Search + Category Filters ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, topics, or mentors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2463]/20 focus:border-[#0A2463] text-sm transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setShowEnrolledOnly(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-[#0A2463] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {cat.icon}
              {cat.label}
              <span className={`text-xs ${activeCategory === cat.id ? "text-white/70" : "text-gray-400"}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Course Grid ── */}
      {filteredCourses.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {showEnrolledOnly
                ? "My Enrolled Courses"
                : activeCategory === "all"
                  ? "All Courses"
                  : categories.find((c) => c.id === activeCategory)?.label}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("all"); setShowEnrolledOnly(false); }}
            className="mt-4 text-sm font-medium text-[#0A2463] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Bottom CTA ── */}
      {!showEnrolledOnly && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8 text-center">
          <Globe className="w-10 h-10 text-[#0A2463] mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Want to teach on PhxNorth?</h3>
          <p className="text-gray-600 text-sm max-w-lg mx-auto mb-5">
            Share your expertise with mentees worldwide. Create structured courses, set your own pricing, and build your teaching brand.
          </p>
          <button className="bg-[#0A2463] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#0A2463]/90 transition-colors inline-flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Become an Instructor
          </button>
        </div>
      )}
    </div>
  );
}
