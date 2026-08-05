import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

  const handleSubmit = async () => {
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    if (isSignup && !email) {
      setError("Email address is required for signup");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include a number and special character (!@#$%^&*)"
      );
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        await signupUser({ username, email, password });
        alert("Account created successfully! Please log in.");
        setIsSignup(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const res = await loginUser({ username, password });
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("username", res.username);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Daily<span className="text-brand-600">Wage</span>
          </h1>
          <p className="text-sm text-gray-500">
            Attendance & Salary Manager
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => { setIsSignup(false); setError(""); }}
            className={`py-2 text-sm font-medium rounded-lg transition-all ${
              !isSignup
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setIsSignup(true); setError(""); }}
            className={`py-2 text-sm font-medium rounded-lg transition-all ${
              isSignup
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
              />
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg pl-10 pr-10 py-2.5 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors"
          >
            {loading ? (
              "Authenticating..."
            ) : (
              <>
                {isSignup ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;