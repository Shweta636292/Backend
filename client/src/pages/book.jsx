
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search, BookOpen, Plus, Pencil, Trash2, X,
  RefreshCw, Library, Filter, Eye, BookMarked
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Books.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Books() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notice, setNotice] = useState("");

  const token = localStorage.getItem("token");

  const api = useMemo(() => axios.create({
    baseURL: API_URL,
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {}
  }), [token]);

  const fetchBooks = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/books", {
        params: { page: pageNumber, limit: 12 }
      });

      const data = response.data;
      const bookList = Array.isArray(data)
        ? data
        : data.books || [];

      setBooks(bookList);
      setPage(data.page || pageNumber);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load books. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, []);

  const categories = [
    "All",
    ...new Set(books.map(book => book.category).filter(Boolean))
  ];

  const filteredBooks = books.filter(book => {
    const query = search.toLowerCase();

    const matchesSearch =
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query);

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const { _id, ...updatedData } = editingBook;

      await api.put(`/books/${_id}`, updatedData);

      setEditingBook(null);
      setNotice("Book updated successfully!");
      await fetchBooks(page);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update book."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (bookId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(bookId);

      await api.delete(`/books/${bookId}`);

      setNotice("Book deleted successfully!");
      setSelectedBook(null);

      await fetchBooks(page);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete book."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="books-page">
      <div className="books-header">
        <div>
          <span className="books-eyebrow">
            <BookOpen size={15} /> YOUR READING COLLECTION
          </span>
          <h1>My Book Collection <span>♡</span></h1>
          <p>Every book has a story. Find your next favourite!</p>
        </div>

        <button
          className="add-book-btn"
          onClick={() => navigate("/add-book")}
        >
          <Plus size={19} /> Add New Book
        </button>
      </div>

      {notice && (
        <div className="books-notice">
          {notice}
          <button onClick={() => setNotice("")}><X size={16}/></button>
        </div>
      )}

      <div className="books-toolbar">
        <div className="books-search">
          <Search size={19}/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by book title or author..."
          />
        </div>

        <div className="books-filter">
          <Filter size={17}/>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <button
          className="refresh-books"
          onClick={() => fetchBooks(page)}
          title="Refresh books"
        >
          <RefreshCw size={18}/>
        </button>
      </div>

      <div className="books-count">
        <div>
          <BookMarked size={20}/>
          <strong>{filteredBooks.length}</strong>
          <span>books on this page</span>
        </div>
        <span>Keep reading, keep growing! 🌷</span>
      </div>

      {loading ? (
        <div className="books-state">
          <div className="books-spinner"/>
          <p>Gathering your lovely books...</p>
        </div>
      ) : error ? (
        <div className="books-state books-error">
          <Library size={42}/>
          <h3>Oops! Something went wrong.</h3>
          <p>{error}</p>
          <button onClick={() => fetchBooks(page)}>Try again</button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="books-state">
          <BookOpen size={48}/>
          <h3>{search ? "No matching books found" : "Your shelf is waiting!"}</h3>
          <p>
            {search
              ? "Try another title or author."
              : "Add your first book to start your collection."}
          </p>
          {!search && (
            <button onClick={() => navigate("/add-book")}>
              <Plus size={17}/> Add your first book
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="books-grid">
            {filteredBooks.map(book => (
              <article className="book-card" key={book._id}>
                <div className="book-cover">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      onError={e => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="book-cover-placeholder">
                      <BookOpen size={48}/>
                      <span>Little Library</span>
                    </div>
                  )}
                  <span className="book-category">
                    {book.category || "General"}
                  </span>
                </div>

                <div className="book-card-content">
                  <h3>{book.title}</h3>
                  <p className="book-author">by {book.author}</p>

                  <div className="book-meta">
                    <span>📚 {book.quantity ?? 0} copies</span>
                    {book.publishedYear && (
                      <span>{book.publishedYear}</span>
                    )}
                  </div>

                  <div className="book-actions">
                    <button
                      className="view-book"
                      onClick={() => setSelectedBook(book)}
                    >
                      <Eye size={16}/> View
                    </button>
                    <button
                      className="edit-book"
                      onClick={() => setEditingBook({...book})}
                      title="Edit book"
                    >
                      <Pencil size={16}/>
                    </button>
                    <button
                      className="delete-book"
                      onClick={() => handleDelete(book._id)}
                      disabled={deletingId === book._id}
                      title="Delete book"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="books-pagination">
              <button
                disabled={page <= 1}
                onClick={() => fetchBooks(page - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => fetchBooks(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedBook && (
        <div className="book-modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="book-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBook(null)}>
              <X/>
            </button>
            <div className="modal-book-cover">
              {selectedBook.coverImage
                ? <img src={selectedBook.coverImage} alt={selectedBook.title}/>
                : <BookOpen size={55}/>}
            </div>
            <h2>{selectedBook.title}</h2>
            <p>by {selectedBook.author}</p>
            <div className="modal-details">
              <span>Category: <strong>{selectedBook.category || "N/A"}</strong></span>
              <span>Year: <strong>{selectedBook.publishedYear || "N/A"}</strong></span>
              <span>Quantity: <strong>{selectedBook.quantity ?? 0}</strong></span>
            </div>
            <button className="modal-done" onClick={() => setSelectedBook(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {editingBook && (
        <div className="book-modal-overlay" onClick={() => setEditingBook(null)}>
          <form
            className="book-edit-modal"
            onSubmit={handleEdit}
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setEditingBook(null)}
            >
              <X/>
            </button>

            <h2>Edit Book <span>✿</span></h2>
            <p>Update your book information.</p>

            {[
              ["title", "Book Title", "text"],
              ["author", "Author", "text"],
              ["category", "Category", "text"],
              ["publishedYear", "Published Year", "number"],
              ["quantity", "Quantity", "number"],
              ["coverImage", "Cover Image URL", "url"]
            ].map(([name, label, type]) => (
              <label key={name}>
                {label}
                <input
                  type={type}
                  required={name !== "coverImage"}
                  min={type === "number" ? 0 : undefined}
                  value={editingBook[name] ?? ""}
                  onChange={e => setEditingBook({
                    ...editingBook,
                    [name]: type === "number" && e.target.value !== ""
                      ? Number(e.target.value)
                      : e.target.value
                  })}
                />
              </label>
            ))}

            <button className="save-book-btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Books;
