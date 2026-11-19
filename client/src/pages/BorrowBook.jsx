
import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Search, CheckCircle, AlertCircle } from "lucide-react";
import "./BorrowBook.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BorrowBook() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/books`);
      const data = response.data;
      setBooks(Array.isArray(data) ? data : data.books || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      setBorrowingId(bookId);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/borrow`,
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Borrow request submitted successfully!");
      await fetchBooks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to borrow this book."
      );
    } finally {
      setBorrowingId(null);
    }
  };

  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();
    return (
      book.title?.toLowerCase().includes(searchText) ||
      book.author?.toLowerCase().includes(searchText) ||
      book.category?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="borrow-books-page">
      <header className="borrow-books-header">
        <div>
          <span>EXPLORE YOUR LIBRARY</span>
          <h1>Borrow a Book 📚</h1>
          <p>Find your next favourite book and start reading.</p>
        </div>
      </header>

      <div className="borrow-search">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by title, author or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {message && (
        <div className="borrow-success">
          <CheckCircle size={19} />
          {message}
        </div>
      )}

      {error && (
        <div className="borrow-error">
          <AlertCircle size={19} />
          {error}
        </div>
      )}

      {loading ? (
        <p className="borrow-loading">Loading books...</p>
      ) : filteredBooks.length === 0 ? (
        <div className="borrow-no-books">
          <BookOpen size={45} />
          <h2>No books found</h2>
          <p>Try another search.</p>
        </div>
      ) : (
        <div className="borrow-books-grid">
          {filteredBooks.map((book) => {
            const available = Number(book.quantity) > 0;

            return (
              <article className="borrow-book-card" key={book._id}>
                <div className="borrow-book-image">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} />
                  ) : (
                    <BookOpen size={48} />
                  )}
                </div>

                <div className="borrow-book-info">
                  <span className="borrow-book-category">
                    {book.category || "General"}
                  </span>

                  <h3>{book.title}</h3>
                  <p>By {book.author}</p>

                  <div className="borrow-availability">
                    {available
                      ? `${book.quantity} available`
                      : "Currently unavailable"}
                  </div>

                  <button
                    className="borrow-book-button"
                    disabled={!available || borrowingId === book._id}
                    onClick={() => handleBorrow(book._id)}
                  >
                    {borrowingId === book._id
                      ? "Processing..."
                      : available
                        ? "Borrow Book"
                        : "Unavailable"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
