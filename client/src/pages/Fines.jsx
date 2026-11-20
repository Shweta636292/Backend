
import { useEffect, useState } from "react";
import axios from "axios";
import {
  IndianRupee,
  Receipt,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import "./Fines.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Fines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFines = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/fines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setFines(Array.isArray(data) ? data : data.fines || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load fines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const unpaidFines = fines.filter(
    (fine) => fine.status?.toLowerCase() !== "paid" && !fine.paid
  );

  const paidFines = fines.filter(
    (fine) => fine.status?.toLowerCase() === "paid" || fine.paid
  );

  const totalUnpaid = unpaidFines.reduce(
    (total, fine) => total + Number(fine.amount || 0),
    0
  );

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "Not available";

  return (
    <div className="fines-page">
      <div className="fines-header">
        <div>
          <span>LIBRARY ACCOUNT</span>
          <h1>My Fines 💰</h1>
          <p>Track your overdue charges and payment status.</p>
        </div>

        <button className="fines-refresh" onClick={fetchFines}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="fines-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="fines-summary">
        <div className="fine-summary-card">
          <IndianRupee size={25} />
          <div>
            <h2>₹{totalUnpaid.toFixed(2)}</h2>
            <p>Total unpaid fines</p>
          </div>
        </div>

        <div className="fine-summary-card">
          <Clock size={25} />
          <div>
            <h2>{unpaidFines.length}</h2>
            <p>Unpaid records</p>
          </div>
        </div>

        <div className="fine-summary-card">
          <CheckCircle size={25} />
          <div>
            <h2>{paidFines.length}</h2>
            <p>Paid records</p>
          </div>
        </div>
      </div>

      <div className="fines-section">
        <h2>
          <Receipt size={20} />
          Fine History
        </h2>

        {loading ? (
          <p className="fines-empty">Loading fines...</p>
        ) : fines.length === 0 ? (
          <div className="fines-empty">
            <CheckCircle size={42} />
            <h3>No fines found!</h3>
            <p>You don't have any fine records.</p>
          </div>
        ) : (
          <div className="fines-table-wrapper">
            <table className="fines-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {fines.map((fine) => {
                  const isPaid =
                    fine.status?.toLowerCase() === "paid" || fine.paid;

                  const book =
                    typeof fine.book === "object" && fine.book
                      ? fine.book
                      : {};

                  return (
                    <tr key={fine._id}>
                      <td>{book.title || fine.bookTitle || "Library fine"}</td>
                      <td>₹{Number(fine.amount || 0).toFixed(2)}</td>
                      <td>{formatDate(fine.dueDate)}</td>
                      <td>
                        <span
                          className={`fine-status ${
                            isPaid ? "paid" : "unpaid"
                          }`}
                        >
                          {isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
