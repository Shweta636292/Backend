
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Search,
  UserRound,
  Mail,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./UserManagement.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const name = (user.name || user.username || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const searchText = search.toLowerCase();

    const matchesSearch =
      name.includes(searchText) || email.includes(searchText);

    const matchesRole =
      roleFilter === "all" ||
      (user.role || "member").toLowerCase() === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <span>ADMINISTRATION</span>
          <h1>User Management 👥</h1>
          <p>Manage and monitor registered library members.</p>
        </div>

        <button className="users-refresh" onClick={fetchUsers}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="users-error">
          <AlertCircle size={19} />
          {error}
        </div>
      )}

      <div className="users-summary">
        <div className="users-summary-icon">
          <Users size={27} />
        </div>
        <div>
          <h2>{users.length}</h2>
          <p>Total registered users</p>
        </div>
      </div>

      <div className="users-toolbar">
        <div className="users-search">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="librarian">Librarians</option>
          <option value="admin">Admins</option>
          <option value="member">Members</option>
        </select>
      </div>

      <div className="users-table-container">
        <div className="users-table-heading">
          <h2>Registered Users</h2>
          <span>{filteredUsers.length} users found</span>
        </div>

        {loading ? (
          <div className="users-empty">Loading users...</div>
        ) : error ? (
          <div className="users-empty">Unable to display users.</div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-empty">
            <Users size={42} />
            <h3>No users found</h3>
            <p>Try changing your search or role filter.</p>
          </div>
        ) : (
          <div className="users-table-scroll">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account ID</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id || user.id}>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">
                          {(user.name || user.username || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <strong>
                          {user.name || user.username || "Unknown"}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <span className="user-email">
                        <Mail size={15} />
                        {user.email || "Not available"}
                      </span>
                    </td>

                    <td>
                      <span className="user-role">
                        <ShieldCheck size={14} />
                        {user.role || "Member"}
                      </span>
                    </td>

                    <td className="user-id">
                      {user._id || user.id || "Not available"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
