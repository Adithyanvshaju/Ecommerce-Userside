
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminProducts,
  toggleProductStatus,
} from "../../services/api";
import "./AdminProducts.css";

const PRODUCTS_PER_PAGE = 8;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null);
  const [confirmProduct, setConfirmProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const fetchProducts = async (page = currentPage) => {
    setLoading(true);

    try {
      const response = await getAdminProducts(page);
      const data = response.data;

      if (Array.isArray(data)) {
        setProducts(data);
        setTotalProducts(data.length);
      } else {
        setProducts(Array.isArray(data.results) ? data.results : []);
        setTotalProducts(data.count || 0);
      }
    } catch (error) {
      console.error("Failed to load products:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.detail ||
          "Unable to load products.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const isBlocked = (product) => product.is_active === false;

  const handleToggleStatus = async () => {
    if (!confirmProduct || busyId !== null) return;

    const product = confirmProduct;
    const wasBlocked = isBlocked(product);
    const newActiveStatus = wasBlocked;

    setConfirmProduct(null);
    setBusyId(product.id);
    setMessage(null);

    try {
      const response = await toggleProductStatus(product.id);
      const updatedProduct = response.data;

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                ...updatedProduct,
                is_active:
                  typeof updatedProduct.is_active === "boolean"
                    ? updatedProduct.is_active
                    : newActiveStatus,
              }
            : item
        )
      );

      setMessage({
        type: "success",
        text: `${product.name} has been ${
          newActiveStatus ? "unblocked" : "blocked"
        } successfully.`,
      });
    } catch (error) {
      console.error("Failed to update product status:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to update product status.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const selectedBlocked = confirmProduct
    ? isBlocked(confirmProduct)
    : false;

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="admin-products">
      {message && (
        <div className={`products-toast ${message.type}`} role="status">
          <span className="products-toast-icon">
            {message.type === "success" ? "✓" : "!"}
          </span>

          <span>{message.text}</span>

          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {confirmProduct && (
        <div
          className="products-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConfirmProduct(null);
            }
          }}
        >
          <div
            className="products-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-confirm-title"
          >
            <div
              className={`products-confirm-icon ${
                selectedBlocked ? "unblock" : "block"
              }`}
            >
              {selectedBlocked ? "✓" : "⊘"}
            </div>

            <h2 id="product-confirm-title">
              {selectedBlocked ? "Unblock product?" : "Block product?"}
            </h2>

            <p>
              Are you sure you want to{" "}
              {selectedBlocked ? "unblock" : "block"}{" "}
              <strong>{confirmProduct.name}</strong>?
            </p>

            <div className="products-confirm-actions">
              <button
                type="button"
                className="products-cancel-btn"
                onClick={() => setConfirmProduct(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className={`products-submit-btn ${
                  selectedBlocked ? "unblock" : "block"
                }`}
                onClick={handleToggleStatus}
              >
                {selectedBlocked ? "Unblock product" : "Block product"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-products-header">
        <div>
          <span className="products-eyebrow">ADMINISTRATION</span>
          <h1>Manage Products</h1>
          <p>View and manage your store products.</p>
        </div>

        <div className="products-header-actions">
          <button
            type="button"
            className="products-refresh-btn"
            onClick={() => fetchProducts(currentPage)}
            disabled={loading || busyId !== null}
          >
            ↻ Refresh
          </button>

          <Link to="/admin/products/add" className="btn-primary">
            + Add New Product
          </Link>
        </div>
      </div>

      <div className="products-table-container">
        {loading ? (
          <p className="products-state">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="products-state">No products found.</p>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const blocked = isBlocked(product);

                  return (
                    <tr key={product.id}>
                      <td>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        ) : (
                          <div className="product-thumbnail placeholder">
                            No image
                          </div>
                        )}
                      </td>

                      <td className="product-name">{product.name}</td>

                      <td>
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span
                          className={`product-status ${
                            blocked ? "status-blocked" : "status-active"
                          }`}
                        >
                          <span className="product-status-dot" />
                          {blocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td>
                        <div className="product-actions">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="btn-edit"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className={blocked ? "btn-unblock" : "btn-block"}
                            onClick={() => setConfirmProduct(product)}
                            disabled={busyId !== null}
                          >
                            {busyId === product.id
                              ? "Updating..."
                              : blocked
                              ? "Unblock"
                              : "Block"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="products-pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                type="button"
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

