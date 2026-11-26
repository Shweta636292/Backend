
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, User, Calendar, Layers } from "lucide-react";
import axios from "axios";
import "./BookDetails.css";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setBook(response.data.book || response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <p className="book-details-message">Loading book details...</p>;
  if (error) return <p className="book-details-message">{error}</p>;
  if (!book) return <p className="book-details-message">Book not found.</p>;

  return (
    <div className="book-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="book-details-card">
        <div className="book-details-image">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} />
          ) : (
            <BookOpen size={90} />
          )}
        </div>

        <div className="book-details-info">
          <span className="book-details-label">BOOK INFORMATION</span>
          <h1>{book.title}</h1>

          <div className="detail-item">
            <User />
            <span><strong>Author:</strong> {book.author}</span>
          </div>

          <div className="detail-item">
            <Layers />
            <span><strong>Category:</strong> {book.category}</span>
          </div>

          <div className="detail-item">
            <Calendar />
            <span><strong>Published Year:</strong> {book.publishedYear || "Not available"}</span>
          </div>

          <div className="detail-item">
            <BookOpen />
            <span><strong>Quantity:</strong> {book.quantity}</span>
          </div>

          <div className={`availability ${book.quantity > 0 ? "available" : "unavailable"}`}>
            {book.quantity > 0 ? "Available for borrowing" : "Currently unavailable"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
