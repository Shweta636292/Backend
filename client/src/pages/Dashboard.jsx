
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Repeat,
  Wallet,
  ChartColumn,
  Settings,
  Search,
  Bell,
  UserRound,
  Plus,
  ArrowRight,
  Clock3,
  BookPlus,
  RotateCcw,
  Sparkles,
  Quote,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./Dashboard.css";

const API = "http://localhost:3000";

function Dashboard() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  // Load books and borrowing history independently
  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError("");

      // Fetch books
      try {
        const bookResponse = await axios.get(`${API}/books`);
        const bookData = bookResponse.data;

        setBooks(
          Array.isArray(bookData)
            ? bookData
            : bookData.books || []
        );
      } catch (err) {
        console.error("Books loading error:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load books. Please try again."
        );
        setBooks([]);
      }

      // Fetch borrowing history separately
      try {
        const borrowResponse = await axios.get(
          `${API}/api/borrow/my-books`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const borrowData = borrowResponse.data;

        setBorrowedBooks(
          Array.isArray(borrowData)
            ? borrowData
            : borrowData.borrowedBooks || []
        );
      } catch (err) {
        console.error("Borrow history error:", err);
        setBorrowedBooks([]);
      }

      setLoading(false);
    };

    loadDashboard();
  }, [navigate]);

  // Active borrowed books
  const activeBorrows = borrowedBooks.filter(
    (item) => item.status?.toLowerCase() === "borrowed"
  );

  // Overdue books
  const overdueBooks = activeBorrows.filter(
    (item) =>
      item.dueDate &&
      new Date(item.dueDate) < new Date()
  );

  // Total copies
  const totalCopies = books.reduce(
    (total, book) =>
      total + (Number(book.quantity) || 0),
    0
  );

  // Search books
  const filteredBooks = books.filter((book) => {
    const query = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.category?.toLowerCase().includes(query)
    );
  });

  const getBookTitle = (item) =>
    item.book?.title ||
    item.bookId?.title ||
    item.title ||
    "Borrowed book";

  const getBookAuthor = (item) =>
    item.book?.author ||
    item.bookId?.author ||
    item.author ||
    "Library collection";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Sidebar menu
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      active: true,
    },
    { label: "Books", icon: BookOpen, path: "/books" },
    { label: "Members", icon: Users, path: "/members" },
    { label: "Borrow & Return", icon: Repeat, path: "/borrow" },
    { label: "Fines", icon: Wallet, path: "/fines" },
    { label: "Reports", icon: ChartColumn, path: "/reports" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  // Quick actions
  const quickActions = [
    {
      label: "Add Book",
      icon: Plus,
      path: "/books/add",
      color: "quick-purple",
    },
    {
      label: "Manage Members",
      icon: Users,
      path: "/members",
      color: "quick-blue",
    },
    {
      label: "Issue Book",
      icon: BookPlus,
      path: "/borrow",
      color: "quick-green",
    },
    {
      label: "Return Book",
      icon: RotateCcw,
      path: "/borrow",
      color: "quick-pink",
    },
    {
      label: "View Reports",
      icon: ChartColumn,
      path: "/reports",
      color: "quick-sky",
    },
  ];

  return (
    <div className="library-dashboard">

      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`library-sidebar ${
          mobileMenu ? "sidebar-open" : ""
        }`}
      >
        <div className="library-logo">
          <div className="logo-icon">
            <BookOpen size={28} />
          </div>

          <span>Little Library</span>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <p className="sidebar-heading">MAIN MENU</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`sidebar-link ${
                  item.active ? "selected" : ""
                }`}
                onClick={() => {
                  setMobileMenu(false);

                  if (!item.active) {
                    navigate(item.path);
                  }
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-decoration">
            <Sparkles size={20} />
            <strong>A little reading goes a long way.</strong>
            <p>Discover a new story every day.</p>
          </div>

          <button
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main dashboard */}
      <main className="dashboard-content">

        {/* Top navigation */}
        <header className="dashboard-topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(true)}
            aria-label="Open navigation"
          >
            <Menu size={23} />
          </button>

          <div className="top-search">
            <Search size={21} />

            <input
              type="text"
              placeholder="Search books, authors, or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="topbar-profile">
            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={22} />
              <span />
            </button>

            <div className="profile-avatar">
              <UserRound size={23} />
            </div>
          </div>
        </header>

        <div className="dashboard-columns">

          {/* Primary section */}
          <section className="dashboard-primary">

            {/* Welcome banner */}
            <div className="welcome-banner">
              <div className="welcome-copy">
                <span className="welcome-label">
                  YOUR LITTLE WORLD OF BOOKS
                </span>

                <h1>
                  Welcome to <span>Little Library</span>
                </h1>

                <p>
                  Hello, {user?.name || user?.fullName || "Reader"}!
                  Manage your reading journey and discover your next
                  favourite book.
                </p>

                <button onClick={() => navigate("/books")}>
                  Explore Books
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="welcome-art" aria-hidden="true">
                <div className="art-sparkle sparkle-one">✦</div>
                <div className="art-sparkle sparkle-two">✧</div>

                <div className="art-books">
                  <div className="art-book art-book-one" />
                  <div className="art-book art-book-two" />
                  <div className="art-book art-book-three" />
                </div>

                <div className="art-flower">✿</div>
              </div>
            </div>

            {/* Book collection */}
            <section className="collection-section">
              <div className="section-title-row">
                <div>
                  <span className="section-eyebrow">
                    FIND YOUR NEXT READ
                  </span>

                  <h2>
                    <BookOpen size={23} />
                    Book Collection
                  </h2>
                </div>

                <button
                  className="text-link"
                  onClick={() => navigate("/books")}
                >
                  View All
                  <ArrowRight size={16} />
                </button>
              </div>

              {loading ? (
                <div className="dashboard-message">
                  Loading your book collection...
                </div>
              ) : error ? (
                <div className="dashboard-message">
                  {error}
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="dashboard-message">
                  {search
                    ? "No books match your search."
                    : "No books are available yet."}
                </div>
              ) : (
                <div className="collection-grid">
                  {filteredBooks.slice(0, 5).map((book, index) => (
                    <article
                      className="collection-card"
                      key={book._id || index}
                    >
                      <div className="collection-cover">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={`${book.title} front cover`}
                            className="book-cover-image"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="blank-book-cover" />
                        )}
                      </div>

                      <h3>
                        {book.title || "Untitled Book"}
                      </h3>

                      <p>
                        {book.author || "Unknown Author"}
                      </p>

                      <div className="book-card-bottom">
                        <span className="category-chip">
                          {book.category || "General"}
                        </span>

                        <span className="book-quantity">
                          {Number(book.quantity) > 0
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Quick actions */}
            <section className="quick-section">
              <div className="section-title-row">
                <div>
                  <span className="section-eyebrow">
                    MAKE THINGS HAPPEN
                  </span>

                  <h2>
                    <Sparkles size={22} />
                    Quick Actions
                  </h2>
                </div>
              </div>

              <div className="quick-actions-grid">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.label}
                      className={`quick-action ${action.color}`}
                      onClick={() => navigate(action.path)}
                    >
                      <Icon size={25} />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </section>

          {/* Secondary section */}
          <aside className="dashboard-secondary">

            {/* Library overview */}
            <section className="overview-card">
              <h2>
                <ChartColumn size={22} />
                Library Overview
              </h2>

              <div className="overview-grid">
                <div className="overview-stat stat-blue">
                  <div className="overview-icon">
                    <BookOpen size={24} />
                  </div>

                  <div>
                    <strong>
                      {loading ? "—" : totalCopies}
                    </strong>
                    <span>Total Copies</span>
                  </div>
                </div>

                <div className="overview-stat stat-purple">
                  <div className="overview-icon">
                    <BookOpen size={24} />
                  </div>

                  <div>
                    <strong>
                      {loading ? "—" : books.length}
                    </strong>
                    <span>Book Titles</span>
                  </div>
                </div>

                <div className="overview-stat stat-green">
                  <div className="overview-icon">
                    <Repeat size={24} />
                  </div>

                  <div>
                    <strong>
                      {loading ? "—" : activeBorrows.length}
                    </strong>
                    <span>My Borrowed</span>
                  </div>
                </div>

                <div className="overview-stat stat-orange">
                  <div className="overview-icon">
                    <Clock3 size={24} />
                  </div>

                  <div>
                    <strong>
                      {loading ? "—" : overdueBooks.length}
                    </strong>
                    <span>My Overdue</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent activity */}
            <section className="activity-card">
              <h2>
                <Clock3 size={22} />
                Recent Activity
              </h2>

              {loading ? (
                <p className="activity-empty">
                  Loading activity...
                </p>
              ) : borrowedBooks.length === 0 ? (
                <p className="activity-empty">
                  Your borrowing activity will appear here.
                </p>
              ) : (
                <div className="activity-list">
                  {borrowedBooks.slice(0, 5).map((item, index) => (
                    <div
                      className="activity-row"
                      key={item._id || index}
                    >
                      <div className="activity-icon">
                        <BookOpen size={19} />
                      </div>

                      <div className="activity-description">
                        <strong>
                          {getBookTitle(item)}
                        </strong>

                        <span>
                          {item.status === "returned"
                            ? "Book returned"
                            : "Book borrowed"}
                        </span>
                      </div>

                      <span className="activity-dot" />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quote */}
            <section className="quote-card">
              <div className="quote-heading">
                <Quote size={26} />
                <h2>Quote of the Day</h2>
              </div>

              <p>
                “A library is a place where ideas grow and minds explore.”
              </p>

              <span className="quote-decoration">✿</span>
            </section>
          </aside>
        </div>

        {/* Error message */}
        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* Footer */}
        <footer className="dashboard-footer">
          Made with love for every book lover.
          <span> ✦ </span>
          Little Library
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
