import React, { createContext, useState, useEffect } from "react";
import { login as loginService, logout as logoutService } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (username, role) => {
    const userData = await loginService(username, role);
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
