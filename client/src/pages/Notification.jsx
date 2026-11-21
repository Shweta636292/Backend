
import { useState } from "react";
import {
  Bell,
  BookOpen,
  Clock,
  IndianRupee,
  CheckCircle,
  Trash2,
  CheckCheck,
} from "lucide-react";
import "./Notifications.css";

const initialNotifications = [
  {
    id: 1,
    title: "Book borrowed successfully",
    message: "Your book borrowing request was successful.",
    type: "borrow",
    time: "Today",
    read: false,
  },
  {
    id: 2,
    title: "Due date reminder",
    message: "Remember to return your borrowed book before its due date.",
    type: "reminder",
    time: "Yesterday",
    read: false,
  },
  {
    id: 3,
    title: "Fine reminder",
    message: "Please check your library account for any unpaid fines.",
    type: "fine",
    time: "2 days ago",
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "borrow":
        return <BookOpen />;
      case "reminder":
        return <Clock />;
      case "fine":
        return <IndianRupee />;
      default:
        return <Bell />;
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <span>STAY UPDATED</span>
          <h1>Notifications 🔔</h1>
          <p>All your library updates in one place.</p>
        </div>

        <div className="notification-count">
          <Bell size={22} />
          <span>{unreadCount} unread</span>
        </div>
      </div>

      <div className="notification-actions">
        <h2>Recent Notifications</h2>

        <button onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCheck size={17} />
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="notifications-empty">
          <Bell size={45} />
          <h2>You're all caught up!</h2>
          <p>No notifications available.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((item) => (
            <div
              className={`notification-card ${!item.read ? "unread" : ""}`}
              key={item.id}
            >
              <div className={`notification-icon ${item.type}`}>
                {getIcon(item.type)}
              </div>

              <div className="notification-content">
                <div className="notification-title">
                  <h3>{item.title}</h3>
                  {!item.read && <span className="unread-dot" />}
                </div>

                <p>{item.message}</p>
                <small>{item.time}</small>
              </div>

              <div className="notification-buttons">
                {!item.read && (
                  <button
                    title="Mark as read"
                    onClick={() => markAsRead(item.id)}
                  >
                    <CheckCircle size={18} />
                  </button>
                )}

                <button
                  title="Delete notification"
                  onClick={() => deleteNotification(item.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
