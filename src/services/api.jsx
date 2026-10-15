
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the access token to authenticated requests.
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh expired access tokens.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login/") &&
      !originalRequest.url?.includes("/token/refresh/") &&
      !originalRequest.url?.includes("/admin/login/")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = response.data.access;

        localStorage.setItem("access", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Authentication endpoints.
export const loginUser = (credentials) =>
  api.post("login/", credentials);

export const registerUser = (userData) =>
  api.post("register/", userData);

export const verifyOTP = (data) =>
  api.post("verify-otp/", data);

export const adminLogin = (credentials) =>
  api.post("admin/login/", credentials);

// Admin dashboard - requires a matching backend endpoint.
export const getAdminStats = () =>
  api.get("admin/stats/");

// Product management.
export const getAdminProducts = (page = 1) =>
  api.get(`admin/products/?page=${page}`);

export const getProductById = (id) =>
  api.get(`products/${id}/`);

export const addProduct = (productData) =>
  api.post("admin/products/add/", productData);

export const updateProduct = (id, productData) =>
  api.put(`admin/products/${id}/`, productData);

export const deleteProduct = (id) =>
  api.delete(`products/${id}/`);

export const toggleProductStatus = (id) =>
  api.patch(`products/${id}/toggle-status/`);

// Admin user management.
export const getAdminUsers = () =>
  api.get("admin/users/");

export const getAdminUserDetails = (id) =>
  api.get(`admin/users/${id}/`);

export const toggleUserBlockStatus = (id) =>
  api.patch(`admin/users/${id}/toggle-block/`);

export const deleteUser = (id) =>
  api.delete(`admin/users/${id}/`);

// Admin order management.
export const getAdminOrders = (page = 1) =>
  api.get(`admin/orders/?page=${page}`);

export const updateOrderStatus = (orderId, status) =>
  api.patch(`admin/orders/${orderId}/update-status/`, { status });

export default api;