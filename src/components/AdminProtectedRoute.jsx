
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Checking admin access...</p>;
  }

  const accessToken = localStorage.getItem("access");

  const isAdmin =
    user &&
    accessToken &&
    (user.is_staff === true || user.is_superuser === true);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;