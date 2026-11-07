
import { useState } from "react";
import axios from "axios";
import {
  BookOpen,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:3000/api/auth/register",
        { name, email, password }
      );

      setMessage("Account created successfully! Please sign in.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-container">
        <div className="register-art">
          <div className="register-brand">
            <BookOpen size={25} />
            <span>Little Library</span>
          </div>

          <div className="register-art-content">
            <span>YOUR NEXT CHAPTER STARTS HERE ✨</span>
            <h1>
              A beautiful place
              <br />
              for <span>book lovers.</span>
            </h1>
            <p>
              Create your account and discover a world
              filled with stories, knowledge and imagination.
            </p>

            <div className="register-books">
              <div className="register-book pink">STORIES</div>
              <div className="register-book blue">DREAMS</div>
              <div className="register-book purple">KNOWLEDGE</div>
              <div className="register-book yellow">MAGIC</div>
            </div>

            <div className="register-note">
              ☁ Your little reading corner awaits ♡
            </div>
          </div>

          <div className="register-footer">
            Made with love for book lovers ♡
          </div>
        </div>

        <div className="register-form-section">
          <div className="register-decoration">✿</div>

          <div className="register-heading">
            <span>JOIN OUR LITTLE WORLD ♡</span>
            <h2>Create your account</h2>
            <p>Let's begin your reading journey!</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Full name</label>
            <div className="register-input">
              <User size={18} />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <label>Email address</label>
            <div className="register-input">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label>Password</label>
            <div className="register-input">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="register-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label>Confirm password</label>
            <div className="register-input">
              <Lock size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <p className="register-message" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="register-login-link">
            Already have an account? <a href="/login">Sign in</a>
          </div>

          <div className="register-bottom">
            A little reading, a lot of happiness ♡
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;
