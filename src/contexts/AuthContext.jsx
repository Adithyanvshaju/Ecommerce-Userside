
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("access");
      const savedUser = localStorage.getItem("user");

      if (accessToken && savedUser) {
        setUser(JSON.parse(savedUser));
      } else if (accessToken) {
        setUser({ authenticated: true });
      }
    } catch (error) {
      console.error("Failed to restore login session:", error);
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    if (data.access) {
      localStorage.setItem("access", data.access);
    }

    if (data.refresh) {
      localStorage.setItem("refresh", data.refresh);
    }

    const isStaff = Boolean(
      data.is_staff || data.is_superuser
    );

    const userData = {
      username: data.username || "User",
      email: data.email || "",
      is_staff: isStaff,
      is_superuser: Boolean(data.is_superuser),
      authenticated: true,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("is_staff", String(isStaff));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    localStorage.removeItem("is_staff");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);