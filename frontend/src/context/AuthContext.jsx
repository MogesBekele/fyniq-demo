// src/context/AuthContext.jsx
import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});
