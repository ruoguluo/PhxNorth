import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import logo from "figma:asset/b1f426d4ba424225ba35199a602ba050b5c13573.png";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/app/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="PhxNorth" className="h-12" />
            <span className="text-2xl font-bold text-[#0A2463]">PhxNorth</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your learning journey</p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-[#0A2463] border-gray-300 rounded focus:ring-[#0A2463]" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#0A2463] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="block w-full bg-[#0A2463] text-white py-3 rounded-lg hover:bg-[#0A2463]/90 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <Link to="/role-selection" className="text-sm text-[#0A2463] hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          By signing in, you agree to our{" "}
          <a href="#" className="text-[#0A2463] hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-[#0A2463] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}