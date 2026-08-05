import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setError("Email is required for signup");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include a number and special character"
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

        alert("Signup successful! Please login.");
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
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <center>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #6366F1, #4F46E5)", color: "#FFF", fontSize: "1.4rem", marginBottom: "10px" }}>
            ⚡
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#FFF", margin: 0 }}>DailyWage</h1>
          <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginTop: "4px", marginBottom: "20px" }}>Workforce Management System</p>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#F8FAFC", marginBottom: "15px" }}>
            {isSignup ? "Create an Account" : "Welcome Back"}
          </h2>
        </center>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {isSignup && (
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        )}

        {error && (
          <p style={{ color: "#EF4444", fontSize: "0.85rem", marginTop: "8px", fontWeight: "500" }}>{error}</p>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{ marginTop: "16px" }}>
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
          style={{ cursor: "pointer", textAlign: "center", marginTop: "16px", color: "#818CF8", fontSize: "0.88rem" }}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}

export default Login;