import { AuthContext } from "./AuthContext";
import { useState, useEffect } from "react";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (username, role) => {
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Login failed");
        return null;
      }
      setUser(data);
      localStorage.setItem("auth", JSON.stringify(data));
      return data;
    } catch (err) {
      console.error("Login error:", err);
      return null;
    }
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
