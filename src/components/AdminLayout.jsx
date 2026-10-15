
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate("/login", { replace: true });
};

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin</h2>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/products/add"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Add Product
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Orders
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;