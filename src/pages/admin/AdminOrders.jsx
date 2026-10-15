import React, { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../../services/api";
import "./AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async (currentPage) => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminOrders(currentPage);
      const data = response.data;

      console.log("Admin orders API response:", data);

      if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1);
      } else if (data && Array.isArray(data.results)) {
        setOrders(data.results);
        setTotalPages(Math.max(1, Math.ceil((data.count || 0) / 10)));
      } else {
        setOrders([]);
        setTotalPages(1);
        setError("The orders API returned an unexpected response.");
      }
    } catch (err) {
      console.error("Failed to load orders:", err);

      setOrders([]);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          `Unable to load orders. HTTP status: ${
            err.response?.status || "No response"
          }`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError("");

    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders(page);
    } catch (err) {
      console.error("Failed to update order status:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to update order status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-orders-page">
      <h1>Order Management</h1>

      {error && (
        <p className="orders-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>

                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>{order.total_items ?? order.items?.length ?? 0}</td>

                  
<td>
  ₹{Number(
    order.total_amount ?? order.total_price ?? 0
  ).toLocaleString("en-IN")}
</td>


                  <td>
                    <span
                      className={`order-badge ${String(
                        order.status || "",
                      ).toLowerCase()}`}
                    >
                      {order.status || "Unknown"}
                    </span>
                  </td>

                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="status-select"
                      disabled={updatingId === order.id}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;
