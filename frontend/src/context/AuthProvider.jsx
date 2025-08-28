// src/context/AuthProvider.jsx
import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (username, role) => {
    const userData = { username, role, token: "mock-jwt-token" };
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
