import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Globe,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { language, setLanguage, t, languages } = useLanguage();

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
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
      {/* Language Selector Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-3 py-1.5 shadow-xs">
        <Globe className="w-4 h-4 text-stone-400" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent text-xs sm:text-sm font-medium text-stone-700 outline-none cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-stone-900">
            Daily<span className="text-brand-600">Wage</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {t("tagline")}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => { setIsSignup(false); setError(""); }}
            className={`py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              !isSignup
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {t("loginTab")}
          </button>
          <button
            onClick={() => { setIsSignup(true); setError(""); }}
            className={`py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
              isSignup
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {t("signupTab")}
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">{t("usernameLabel")}</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
              />
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">{t("emailLabel")}</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">{t("passwordLabel")}</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm rounded-lg pl-10 pr-10 py-2.5 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">{t("confirmPasswordLabel")}</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs sm:text-sm text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-xs transition-colors"
          >
            {loading ? (
              t("authenticating")
            ) : (
              <>
                {isSignup ? t("createAccountBtn") : t("signInBtn")}
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