
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  CalendarDays,
  RotateCcw,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./MyBorrowedBooks.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function MyBorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState(null);

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/borrow/my-books`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setBorrowedBooks(Array.isArray(data) ? data : data.borrowedBooks || data.borrows || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load borrowed books."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const handleReturn = async (borrowId) => {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmed) return;

    try {
      setReturningId(borrowId);

      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/borrow/${borrowId}/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Book returned successfully!");
      await fetchBorrowedBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to return book.");
    } finally {
      setReturningId(null);
    }
  };

  const getBook = (borrow) =>
    typeof borrow.book === "object" && borrow.book
      ? borrow.book
      : typeof borrow.bookId === "object" && borrow.bookId
        ? borrow.bookId
        : {};

  const getStatus = (borrow) =>
    borrow.status || (borrow.returnedAt ? "Returned" : "Borrowed");

  if (loading) {
    return (
      <div className="borrow-loading">
        <RefreshCw className="spin" size={28} />
        <p>Loading your borrowed books...</p>
      </div>
    );
  }

  return (
    <div className="borrow-page">
      <div className="borrow-header">
        <div>
          <span className="borrow-subtitle">YOUR LIBRARY</span>
          <h1>My Borrowed Books</h1>
          <p>Keep track of the books you have borrowed.</p>
        </div>

        <button className="borrow-refresh" onClick={fetchBorrowedBooks}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="borrow-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="borrow-summary">
        <BookOpen size={25} />
        <div>
          <h2>{borrowedBooks.length}</h2>
          <p>Total borrowing records</p>
        </div>
      </div>

      {!error && borrowedBooks.length === 0 ? (
        <div className="borrow-empty">
          <BookOpen size={48} />
          <h2>No borrowed books yet</h2>
          <p>Your borrowed books will appear here.</p>
        </div>
      ) : (
        <div className="borrow-grid">
          {borrowedBooks.map((borrow) => {
            const book = getBook(borrow);
            const status = getStatus(borrow);
            const isReturned = status.toLowerCase() === "returned";

            return (
              <div className="borrow-card" key={borrow._id}>
                <div className="borrow-cover">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title || "Book cover"} />
                  ) : (
                    <BookOpen size={48} />
                  )}
                </div>

                <div className="borrow-details">
                  <span
                    className={`borrow-status ${
                      isReturned ? "returned" : "active"
                    }`}
                  >
                    {status}
                  </span>

                  <h3>{book.title || "Book details unavailable"}</h3>
                  <p className="borrow-author">
                    {book.author || "Unknown author"}
                  </p>

                  <div className="borrow-date">
                    <CalendarDays size={16} />
                    <span>
                      Borrowed:{" "}
                      {borrow.borrowDate
                        ? new Date(borrow.borrowDate).toLocaleDateString()
                        : "Not available"}
                    </span>
                  </div>

                  <div className="borrow-date">
                    <CalendarDays size={16} />
                    <span>
                      Due:{" "}
                      {borrow.dueDate
                        ? new Date(borrow.dueDate).toLocaleDateString()
                        : "Not available"}
                    </span>
                  </div>

                  {!isReturned && (
                    <button
                      className="return-button"
                      onClick={() => handleReturn(borrow._id)}
                      disabled={returningId === borrow._id}
                    >
                      <RotateCcw size={16} />
                      {returningId === borrow._id
                        ? "Returning..."
                        : "Return Book"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBorrowedBooks;
