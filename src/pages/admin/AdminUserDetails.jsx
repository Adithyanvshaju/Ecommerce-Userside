import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminUserDetails } from "../../services/api";
import "./AdminUserDetails.css";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const response = await getAdminUserDetails(id);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="admin-user-details-page">
      <button className="btn-back" onClick={() => navigate("/admin/users")}>
        &larr; Back to Users
      </button>
      <div className="details-card">
        <h2>User Details</h2>
        <div className="detail-item">
          <strong>ID:</strong> {user.id}
        </div>
        <div className="detail-item">
          <strong>Username:</strong> {user.username}
        </div>
        <div className="detail-item">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="detail-item">
          <strong>Status:</strong>{" "}
          <span className={`status-badge ${user.is_active ? "active" : "inactive"}`}>
            {user.is_active ? "Active" : "Blocked"}
          </span>
        </div>
        <div className="detail-item">
          <strong>Joined On:</strong> {new Date(user.date_joined).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;