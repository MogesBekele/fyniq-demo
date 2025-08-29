// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    return handleAuth("login", username, password);
  };

  const register = async (username, password, role) => {
    return handleAuth("register", username, password, role);
  };

  const handleAuth = async (endpoint, username, password, role) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/auth/${endpoint}`,
        { username, password, role },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setUser(res.data);
        localStorage.setItem("auth", JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      console.error(`${endpoint} error:`, err.response?.data || err.message);
      return null;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setUser(null);
        localStorage.removeItem("auth");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
