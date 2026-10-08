import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./pages/WishList";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        {/* Public pages */}

        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/Products" element={<Products />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Protected pages */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
