
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  ImagePlus,
  ArrowLeft,
  Plus,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import "./AddBook.css";

const API = "http://localhost:3000";

function AddBook() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    publishedYear: "",
    quantity: "1",
    coverImage: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!form.title.trim() || !form.author.trim() || !form.category.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const quantity = Number(form.quantity);
    const publishedYear = form.publishedYear
      ? Number(form.publishedYear)
      : undefined;

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be a non-negative whole number.");
      return;
    }

    if (
      publishedYear !== undefined &&
      (!Number.isInteger(publishedYear) || publishedYear < 0)
    ) {
      setError("Please enter a valid published year.");
      return;
    }

    if (
      form.coverImage.trim() &&
      !/^https?:\/\/\S+$/i.test(form.coverImage.trim())
    ) {
      setError("Please enter a valid image URL starting with http:// or https://.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      quantity,
      coverImage: form.coverImage.trim()
    };

    if (publishedYear !== undefined) {
      payload.publishedYear = publishedYear;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/books`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMessage(response.data.message || "Book added successfully!");

      setForm({
        title: "",
        author: "",
        category: "",
        publishedYear: "",
        quantity: "1",
        coverImage: ""
      });

    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("You are not authorized to add books. Please check your account role.");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to add the book. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-page">
      <div className="add-book-top">
        <Link to="/dashboard" className="back-dashboard">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="add-book-brand">
          <BookOpen size={25} />
          Little Library
        </div>
      </div>

      <div className="add-book-container">
        <div className="add-book-heading">
          <span>GROW YOUR COLLECTION</span>
          <h1>Add a New Book</h1>
          <p>Add a new story to your library collection.</p>
        </div>

        <div className="add-book-layout">
          <form className="add-book-form" onSubmit={handleSubmit}>
            <h2>Book Information</h2>
            <p className="form-description">
              Enter the details of the book you want to add.
            </p>

            <div className="add-form-group">
              <label htmlFor="title">Book Title *</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="add-form-group">
              <label htmlFor="author">Author Name *</label>
              <input
                id="author"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="add-form-row">
              <div className="add-form-group">
                <label htmlFor="category">Category *</label>
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Fiction"
                  required
                />
              </div>

              <div className="add-form-group">
                <label htmlFor="publishedYear">Published Year</label>
                <input
                  id="publishedYear"
                  name="publishedYear"
                  type="number"
                  min="0"
                  value={form.publishedYear}
                  onChange={handleChange}
                  placeholder="e.g. 2005"
                />
              </div>
            </div>

            <div className="add-form-group">
              <label htmlFor="quantity">Available Quantity *</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-form-group">
              <label htmlFor="coverImage">Book Front Cover Image URL</label>
              <input
                id="coverImage"
                name="coverImage"
                type="url"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="Paste your book cover image URL"
              />
              <small>Leave blank if you don't have a cover image.</small>
            </div>

            {error && (
              <div className="add-form-message error-message">
                <AlertCircle size={17} />
                {error}
              </div>
            )}

            {message && (
              <div className="add-form-message success-message">
                <CheckCircle size={17} />
                {message}
              </div>
            )}

            <div className="add-book-buttons">
              <button
                type="button"
                className="cancel-book-button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-book-button"
                disabled={loading}
              >
                <Plus size={18} />
                {loading ? "Adding Book..." : "Add Book"}
              </button>
            </div>
          </form>

          <aside className="book-preview-panel">
            <div className="preview-title">
              <ImagePlus size={20} />
              <h2>Cover Preview</h2>
            </div>

            <div className="preview-book-cover">
              {form.coverImage ? (
                <img
                  src={form.coverImage}
                  alt="Book cover preview"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="preview-blank-cover">
                  <BookOpen size={42} />
                  <span>YOUR BOOK COVER</span>
                </div>
              )}
            </div>

            <h3>{form.title || "Your Book Title"}</h3>
            <p>{form.author || "Author Name"}</p>

            <div className="preview-category">
              {form.category || "Book Category"}
            </div>

            <div className="preview-note">
              <CheckCircle size={17} />
              <span>Your cover will appear in the library collection after saving.</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default AddBook;
