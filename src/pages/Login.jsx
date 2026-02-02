import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser, signupUser } from "../services/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

  const handleSubmit = async () => {
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
      setError("");

      if (isSignup) {
        await signupUser({ username, password });
        alert("Signup successful! Please login.");
        setIsSignup(false);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        await loginUser({ username, password });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <center>
          <h1>DailyWage</h1>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        </center>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleSubmit}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
          }}
          style={{ cursor: "pointer", textAlign: "center" }}
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
