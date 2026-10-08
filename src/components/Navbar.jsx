
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";

import api from "../services/api";

import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContent";
import { useWishlist } from "../contexts/WishlistContext";

import "./Navbar.css";

function Navbar() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  // =========================
  // SEARCH PRODUCTS FROM BACKEND
  // =========================

  useEffect(() => {

    const getProducts = async () => {

      if (!search.trim()) {
        setProducts([]);
        return;
      }

      try {

        const response = await api.get("/products/", {
          params: {
            search: search
          }
        });

        setProducts(response.data.results);

      } catch (error) {

        console.error(
          "Navbar product error:",
          error.response?.data || error.message
        );

      }
    };

    getProducts();

  }, [search]);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      return;
    }

    navigate(`/products?search=${search}`);
  };

  // =========================
  // PRODUCT CLICK
  // =========================

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);

    setSearch("");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">

      <div className="container navbar-container">

        {/* LOGO */}

        <Link to="/" className="navbar-brand">

          <svg width="40" height="40" viewBox="0 0 100 100">

            <path
              d="M20 80 V20 L50 60 V20 H60 V80 H50 L20 40 V80 Z"
              fill="white"
            />

            <path
              d="M65 20 H85 C92 20 92 35 85 40 C92 45 92 60 85 60 H65 V20 Z"
              fill="white"
            />

          </svg>

          <span className="brand-text">
            NEW BALANCE
          </span>

        </Link>

        {/* SEARCH */}

        <div className="search-container">

          <form
            className="navbar-search"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <button type="submit">
              <FaSearch />
            </button>

          </form>

          {search.trim() !== "" && (

            <div className="search-results">

              {products.length > 0 ? (

                products.slice(0, 5).map((product) => (

                  <div
                    key={product.id}
                    className="search-result-item"
                    onClick={() =>
                      handleProductClick(product.id)
                    }
                  >

                    <span>
                      {product.name}
                    </span>

                    <span>
                      ₹{product.price}
                    </span>

                  </div>

                ))

              ) : (

                <div className="no-search-results">
                  No products found
                </div>

              )}

            </div>

          )}

        </div>

        {/* RIGHT SIDE */}

        <div className="navbar-actions">

          {/* ORDERS */}

          {user && (

            <Link
              to="/orders"
              className="nav-orders-button"
            >
              Orders
            </Link>

          )}

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="nav-icon-link position-relative"
          >

            <FaHeart />

            {user && wishlist.length > 0 && (

              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {wishlist.length}
              </span>

            )}

          </Link>

          {/* CART */}

          <Link
            to="/cart"
            className="nav-icon-link position-relative"
          >

            <FaShoppingCart />

            {user && cart.length > 0 && (

              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>

            )}

          </Link>

          {/* AUTH */}

          {user ? (

            <button
              className="nav-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          ) : (

            <>

              <Link
                to="/login"
                className="nav-login-button"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nav-register-button"
              >
                Register
              </Link>

            </>

          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;

