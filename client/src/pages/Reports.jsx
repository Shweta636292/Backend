
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  BookOpen,
  Users,
  BookMarked,
  IndianRupee,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./Reports.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(response.data.stats || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load library reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <div className="reports-loading">Loading reports...</div>;
  }

  if (error) {
    return (
      <div className="reports-error">
        <AlertCircle size={22} />
        <p>{error}</p>
        <button onClick={fetchReports}>Try Again</button>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Total Books",
      value: stats.totalBooks ?? 0,
      icon: <BookOpen />,
      color: "purple",
    },
    {
      title: "Total Users",
      value: stats.totalUsers ?? 0,
      icon: <Users />,
      color: "pink",
    },
    {
      title: "Borrowed Books",
      value: stats.borrowedBooks ?? 0,
      icon: <BookMarked />,
      color: "blue",
    },
    {
      title: "Total Fines",
      value: `₹${Number(stats.totalFines ?? 0).toFixed(2)}`,
      icon: <IndianRupee />,
      color: "orange",
    },
  ];

  const available = Number(stats.availableBooks ?? 0);
  const borrowed = Number(stats.borrowedBooks ?? 0);
  const total = available + borrowed;
  const availablePercent = total ? (available / total) * 100 : 0;
  const borrowedPercent = total ? (borrowed / total) * 100 : 0;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <span>LIBRARY INSIGHTS</span>
          <h1>Reports & Analytics 📊</h1>
          <p>Monitor your library's performance.</p>
        </div>

        <button className="reports-refresh" onClick={fetchReports}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="reports-grid">
        {cards.map((card) => (
          <div className="report-card" key={card.title}>
            <div className={`report-icon ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p>{card.title}</p>
              <h2>{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="reports-chart-card">
        <h2>
          <BarChart3 size={21} />
          Book Availability
        </h2>

        <div className="reports-bar">
          <div
            className="reports-bar-available"
            style={{ width: `${availablePercent}%` }}
          />
          <div
            className="reports-bar-borrowed"
            style={{ width: `${borrowedPercent}%` }}
          />
        </div>

        <div className="reports-legend">
          <span>
            <i className="available-dot" />
            Available: {available}
          </span>
          <span>
            <i className="borrowed-dot" />
            Borrowed: {borrowed}
          </span>
        </div>
      </div>
    </div>
  );
}
