
import { useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
 const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: email.trim(),
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

navigate("/dashboard");

      const { token, user } = response.data;

      if (!token) {
        throw new Error("Login response did not contain a token.");
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      alert("Login successful! Welcome to Little Library.");

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <section className="login-container">

        {/* Left illustration section */}
        <div className="login-art">

          <div className="brand">
            <div className="brand-icon">
              <BookOpen size={25} />
            </div>
            <span>Little Library</span>
          </div>

          <div className="art-content">
            <span className="welcome-tag">
              A WORLD OF STORIES ✨
            </span>

            <h1>
              Every book opens
              <br />
              a new <span>adventure.</span>
            </h1>

            <p>
              Discover wonderful stories, explore knowledge
              and make every reading moment special.
            </p>

            <div className="book-stack">
              <div className="book book-pink">
                <span>THE ART OF<br />READING</span>
              </div>

              <div className="book book-blue">
                <span>WONDERFUL<br />STORIES</span>
              </div>

              <div className="book book-purple">
                <span>MAGIC OF<br />WORDS</span>
              </div>

              <div className="book book-yellow">
                <span>NEW<br />ADVENTURES</span>
              </div>
            </div>

            <div className="art-note">
              ☁ Make time for a little reading ♡
            </div>
          </div>

          <div className="art-footer">
            Made with love for book lovers <span>♡</span>
          </div>
        </div>

        {/* Right login form */}
        <div className="login-form-section">

          <div className="form-decoration">✿</div>

          <div className="login-heading">
            <span className="small-label">
              WELCOME BACK ♡
            </span>

            <h2>Lovely to see you!</h2>

            <p>
              Sign in to continue your reading journey.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <label htmlFor="email">
              Email address
            </label>

            <div className="input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="password">
              Password
            </label>

            <div className="input-wrapper">
              <Lock size={18} />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            {errorMessage && (
              <p className="login-error" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}

              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <div className="signup-text">
            New to our library?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </div>

          <div className="form-bottom">
            A little reading, a lot of happiness ♡
          </div>

        </div>
      </section>
    </main>
  );
}

export default Login;
