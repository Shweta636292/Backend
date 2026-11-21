
import { useEffect, useState } from "react";
import axios from "axios";
import {
  UserRound,
  Mail,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your profile.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="profile-error">
        <AlertCircle size={22} />
        <p>{error}</p>
        <button onClick={fetchProfile}>Try Again</button>
      </div>
    );
  }

  if (!user) return null;

  const name = user.name || user.username || "Library User";
  const email = user.email || "Email not available";
  const role = user.role || "Member";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-heading">
        <span>MY ACCOUNT</span>
        <h1>My Profile 👤</h1>
        <p>Manage and view your library account information.</p>
      </div>

      <div className="profile-card">
        <div className="profile-cover" />

        <div className="profile-main">
          <div className="profile-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={name} />
            ) : (
              initial
            )}
          </div>

          <h2>{name}</h2>
          <p className="profile-role">{role}</p>
        </div>

        <div className="profile-information">
          <h3>Personal Information</h3>

          <div className="profile-info-row">
            <div className="profile-info-icon">
              <UserRound size={20} />
            </div>
            <div>
              <span>Full Name</span>
              <h4>{name}</h4>
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-icon">
              <Mail size={20} />
            </div>
            <div>
              <span>Email Address</span>
              <h4>{email}</h4>
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span>Account Role</span>
              <h4>{role}</h4>
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-icon">
              <BookOpen size={20} />
            </div>
            <div>
              <span>Account ID</span>
              <h4>{user._id || user.id || "Not available"}</h4>
            </div>
          </div>
        </div>

        <button className="profile-refresh" onClick={fetchProfile}>
          <RefreshCw size={17} />
          Refresh Profile
        </button>
      </div>
    </div>
  );
}
