import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
getAdminUsers,
toggleUserBlockStatus,
deleteUser,
} from "../../services/api";
import "./AdminUsers.css";

const AdminUsers = () => {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [busyId, setBusyId] = useState(null);
const [message, setMessage] = useState(null);
const [confirmAction, setConfirmAction] = useState(null);

const navigate = useNavigate();

// Automatically dismiss notifications after 3 seconds.
useEffect(() => {
if (!message) return;


const timer = setTimeout(() => {
  setMessage(null);
}, 3000);

return () => clearTimeout(timer);


}, [message]);

// Fetch all customers.
const fetchUsers = async () => {
setLoading(true);


try {
  const response = await getAdminUsers();
  const data = response.data;

  const userList = Array.isArray(data)
    ? data
    : Array.isArray(data.results)
    ? data.results
    : [];

  setUsers(userList);
} catch (error) {
  console.error("Failed to load users:", error);

  setMessage({
    type: "error",
    text:
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Unable to load users. Check your connection and permissions.",
  });
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchUsers();
}, []);

// Open our custom confirmation modal.
const askForConfirmation = (user, action) => {
setConfirmAction({ user, action });
};

// Perform the action only after the admin confirms.
const handleConfirmAction = async () => {
if (!confirmAction) return;


const { user, action } = confirmAction;

setConfirmAction(null);
setBusyId(user.id);
setMessage(null);

try {
  if (action === "delete") {
    await deleteUser(user.id);

    setUsers((currentUsers) =>
      currentUsers.filter((item) => item.id !== user.id)
    );

    setMessage({
      type: "success",
      text: `${user.username} was deleted successfully.`,
    });
  } else {
    await toggleUserBlockStatus(user.id);

    setUsers((currentUsers) =>
      currentUsers.map((item) =>
        item.id === user.id
          ? { ...item, is_active: !item.is_active }
          : item
      )
    );

    setMessage({
      type: "success",
      text:
        action === "block"
          ? `${user.username} has been blocked.`
          : `${user.username} has been unblocked.`,
    });
  }
} catch (error) {
  console.error(`Failed to ${action} user:`, error);

  setMessage({
    type: "error",
    text:
      error.response?.data?.detail ||
      error.response?.data?.message ||
      `Unable to ${action} ${user.username}. Please try again.`,
  });
} finally {
  setBusyId(null);
}


};

const filteredUsers = users.filter((user) => {
const query = search.trim().toLowerCase();


return (
  (user.username || "").toLowerCase().includes(query) ||
  (user.email || "").toLowerCase().includes(query)
);


});

const activeUsers = users.filter((user) => user.is_active).length;
const blockedUsers = users.length - activeUsers;

const modalDetails = confirmAction
? {
delete: {
title: "Delete customer?",
description: `Are you sure you want to permanently delete ${confirmAction.user.username}? This action cannot be undone.`,
button: "Delete customer",
icon: "!",
},
block: {
title: "Block customer?",
description: `Are you sure you want to block ${confirmAction.user.username}? They may lose access to their account.`,
button: "Block customer",
icon: "⊘",
},
unblock: {
title: "Unblock customer?",
description: `Allow ${confirmAction.user.username} to access their account again?`,
button: "Unblock customer",
icon: "✓",
},
}[confirmAction.action]
: null;

return ( <div className="admin-users-page">
{/* Temporary notification */}
{message && (
<div
className={`users-toast ${message.type}`}
role={message.type === "error" ? "alert" : "status"}
> <span className="toast-icon">
{message.type === "success" ? "✓" : "!"} </span>


      <span className="toast-text">{message.text}</span>

      <button
        className="toast-close"
        onClick={() => setMessage(null)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  )}

  {/* Confirmation modal */}
  {confirmAction && modalDetails && (
    <div
      className="confirm-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setConfirmAction(null);
        }
      }}
    >
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
      >
        <div
          className={`confirm-icon ${confirmAction.action}`}
        >
          {modalDetails.icon}
        </div>

        <h2 id="confirm-title">{modalDetails.title}</h2>

        <p id="confirm-description">
          {modalDetails.description}
        </p>

        <div className="confirm-user">
          <span className="confirm-avatar">
            {(confirmAction.user.username || "U")
              .charAt(0)
              .toUpperCase()}
          </span>

          <div>
            <strong>{confirmAction.user.username}</strong>
            <small>
              {confirmAction.user.email || "No email address"}
            </small>
          </div>
        </div>

        <div className="confirm-actions">
          <button
            className="confirm-cancel"
            onClick={() => setConfirmAction(null)}
            autoFocus
          >
            Cancel
          </button>

          <button
            className={`confirm-submit ${confirmAction.action}`}
            onClick={handleConfirmAction}
          >
            {modalDetails.button}
          </button>
        </div>
      </div>
    </div>
  )}

  <div className="users-header">
    <div>
      <span className="users-eyebrow">ADMINISTRATION</span>
      <h1>User Management</h1>
      <p>Manage customer accounts and account access.</p>
    </div>

    <button
      className="users-refresh-btn"
      onClick={fetchUsers}
      disabled={loading || busyId !== null}
    >
      ↻ Refresh
    </button>
  </div>

  <div className="users-stats">
    <div className="user-stat-card">
      <span className="stat-icon total-icon">♙</span>
      <div>
        <p>Total Users</p>
        <h2>{users.length}</h2>
      </div>
    </div>

    <div className="user-stat-card">
      <span className="stat-icon active-icon">✓</span>
      <div>
        <p>Active Users</p>
        <h2>{activeUsers}</h2>
      </div>
    </div>

    <div className="user-stat-card">
      <span className="stat-icon blocked-icon">⊘</span>
      <div>
        <p>Blocked Users</p>
        <h2>{blockedUsers}</h2>
      </div>
    </div>
  </div>

  <div className="users-table-card">
    <div className="users-toolbar">
      <div>
        <h2>All Users</h2>
        <p>{filteredUsers.length} users displayed</p>
      </div>

      <input
        className="users-search"
        type="search"
        placeholder="Search username or email..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </div>

    {loading ? (
      <div className="users-state">
        <div className="users-spinner" />
        <p>Loading users...</p>
      </div>
    ) : filteredUsers.length === 0 ? (
      <div className="users-state">
        <span className="empty-users-icon">♙</span>
        <h3>No users found</h3>
        <p>
          {search
            ? "Try another username or email."
            : "There are no users to display."}
        </p>
      </div>
    ) : (
      <div className="users-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email Address</th>
              <th>Account Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-identity">
                    <span className="user-avatar">
                      {(user.username || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <div>
                      <strong>{user.username}</strong>
                      <small>ID: {user.id}</small>
                    </div>
                  </div>
                </td>

                <td>{user.email || "No email"}</td>

                <td>
                  <span
                    className={`status-badge ${
                      user.is_active ? "active" : "inactive"
                    }`}
                  >
                    <span className="status-dot" />
                    {user.is_active ? "Active" : "Blocked"}
                  </span>
                </td>

                <td>
                  <div className="user-actions">
                    <button
                      className="btn-action view"
                      onClick={() =>
                        navigate(`/admin/users/${user.id}`)
                      }
                      disabled={busyId !== null}
                    >
                      View
                    </button>

                    <button
                      className={`btn-action ${
                        user.is_active ? "block" : "unblock"
                      }`}
                      onClick={() =>
                        askForConfirmation(
                          user,
                          user.is_active ? "block" : "unblock"
                        )
                      }
                      disabled={busyId !== null}
                    >
                      {busyId === user.id
                        ? "Please wait..."
                        : user.is_active
                        ? "Block"
                        : "Unblock"}
                    </button>

                    <button
                      className="btn-action delete"
                      onClick={() =>
                        askForConfirmation(user, "delete")
                      }
                      disabled={busyId !== null}
                    >
                      Delete
                    </button>
                  </div>
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
};

export default AdminUsers;
