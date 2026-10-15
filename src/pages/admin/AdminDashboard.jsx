import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getAdminStats } from "../../services/api";
import "./AdminDashboard.css";

const STATUS_COLORS = ["#24a477", "#ed9a38", "#e05252"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_products: 0,
    total_orders: 0,
    paid_orders: 0,
    pending_orders: 0,
    cancelled_orders: 0,
    total_revenue: 0,
    monthly_sales: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
        setError(
          error.response?.data?.detail ||
            "Failed to load dashboard statistics. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const orderStatusData = [
    { name: "Paid", value: Number(stats.paid_orders || 0) },
    { name: "Pending", value: Number(stats.pending_orders || 0) },
    { name: "Cancelled", value: Number(stats.cancelled_orders || 0) },
  ];

  if (loading) {
    return (
      <div className="dashboard-message">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of your store's performance</p>
        </div>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card users-card">
          <span className="stat-label">Total Users</span>
          <h2>{stats.total_users}</h2>
          <p>Registered customers</p>
        </div>

        <div className="stat-card products-card">
          <span className="stat-label">Total Products</span>
          <h2>{stats.total_products}</h2>
          <p>Products in your store</p>
        </div>

        <div className="stat-card orders-card">
          <span className="stat-label">Total Orders</span>
          <h2>{stats.total_orders}</h2>
          <p>Orders placed</p>
        </div>

        <div className="stat-card revenue-card">
          <span className="stat-label">Total Revenue</span>
          <h2>{formatCurrency(stats.total_revenue)}</h2>
          <p>Revenue from paid orders</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <section className="dashboard-section chart-card">
          <h2>Orders Trend</h2>
          <p className="section-description">
            Number of orders placed each month
          </p>

          {stats.monthly_sales.length === 0 ? (
            <p className="empty-sales">No order data available.</p>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.monthly_sales}
                  margin={{ top: 10, right: 20, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#4776e6"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="dashboard-section chart-card">
          <h2>Order Status</h2>
          <p className="section-description">
            Breakdown of paid, pending, and cancelled orders
          </p>

          {stats.total_orders === 0 ? (
            <p className="empty-sales">No orders available.</p>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={stats.total_orders > 0 ? 3 : 0}
                    label={false}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[index]} />
                    ))}
                  </Pie>

                  <Tooltip formatter={(value, name) => [value, name]} />

                  <Legend
                    formatter={(value) => {
                      const item = orderStatusData.find(
                        (entry) => entry.name === value,
                      );
                      return `${value}: ${item?.value ?? 0}`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
