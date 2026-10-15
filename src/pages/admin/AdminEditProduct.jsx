
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/api";
import "./AdminProducts.css";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    gender: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setError("");

        const response = await getProductById(id);
        const product = response.data;

        setForm({
          name: product.name ?? "",
          description: product.description ?? "",
          price: product.price ?? "",
          image: product.image ?? "",

          // The serializer returns the category name.
          // Also support APIs that return a category object.
          category:
            typeof product.category === "object" &&
            product.category !== null
              ? product.category.name ?? ""
              : product.category ?? "",

          gender: product.gender ?? "",
          stock: product.stock ?? "",
        });
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Unable to load this product. Check the product API.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.category.trim() ||
      form.price === "" ||
      !form.image.trim()
    ) {
      setError("Please enter the product name, price, category, and image URL.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price),
        image: form.image.trim(),

        // Send category NAME, not its numeric ID.
        category: form.category.trim(),

        gender: form.gender,
        stock: Number(form.stock || 0),
      };

      await updateProduct(id, payload);

      setSuccess("Product updated successfully.");

      setTimeout(() => {
        navigate("/admin/products");
      }, 900);
    } catch (err) {
      console.error("Failed to update product:", err);

      const data = err.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data).map(([field, value]) => {
          const message = Array.isArray(value)
            ? value.join(", ")
            : typeof value === "object" && value !== null
              ? JSON.stringify(value)
              : String(value);

          return `${field}: ${message}`;
        });

        setError(messages.join(" | "));
      } else {
        setError("Unable to update product. Please check your details.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-products">
        <p className="products-state">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div>
          <span className="products-eyebrow">ADMINISTRATION</span>
          <h1>Edit Product</h1>
          <p>Update the details of this product.</p>
        </div>

        <Link to="/admin/products" className="products-refresh-btn">
          ← Back to products
        </Link>
      </div>

      {error && (
        <div className="products-form-message error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="products-form-message success" role="status">
          {success}
        </div>
      )}

      {!error || form.name ? (
        <form className="product-edit-form" onSubmit={handleSubmit}>
          <label>
            Product name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>

          <div className="product-form-grid">
            <label>
              Price (₹)
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Category name
              <input
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Shoes"
                required
              />
            </label>

            <label>
              Gender
              <input
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Stock
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Image URL
            <input
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              required
            />
          </label>

          {form.image && (
            <img
              src={form.image}
              alt="Product preview"
              className="edit-product-preview"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              onLoad={(event) => {
                event.currentTarget.style.display = "block";
              }}
            />
          )}

          <div className="product-form-actions">
            <Link to="/admin/products" className="products-cancel-link">
              Cancel
            </Link>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default AdminEditProduct;
