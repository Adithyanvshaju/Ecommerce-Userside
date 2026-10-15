
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminAddProduct.css";

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    gender: "Unisex",
    price: "",
    stock: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      await api.post("admin/products/add/", payload);

      setSuccess("Product added successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData && typeof responseData === "object") {
        const messages = Object.entries(responseData).map(
          ([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : typeof value === "object"
                ? JSON.stringify(value)
                : String(value);

            return `${field}: ${message}`;
          }
        );

        setError(messages.join(" | "));
      } else {
        setError("Failed to add product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-product">
      <div className="page-header">
  <h2>Add New Product</h2>
  <p className="page-subtitle">
    Add a new product to your New Balance store.
  </p>
</div>

      {error && (
        <p className="text-danger" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="text-success" role="status">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Shoes, Clothing, Accessories..."
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            className="form-select"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Unisex">Unisex</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            className="form-control"
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            className="form-control"
            type="number"
            name="stock"
            min="0"
            step="1"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Image URL</label>
          <input
            className="form-control"
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/product.jpg"
            required
          />
        </div>

        {formData.image && (
          <div className="mb-3">
            <p>Image Preview</p>
            <img
              src={formData.image}
              alt="Product preview"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              onLoad={(e) => {
                e.currentTarget.style.display = "block";
              }}
              style={{
                width: "200px",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-dark"
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
