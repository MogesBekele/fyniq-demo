// src/services/authService.js

// Mock login function
export const login = async (username, role) => {
  // In a real app, this would be a fetch/axios call
  return { username, role, token: "mock-jwt-token" };
};

// Mock logout function
export const logout = async () => {
  // In a real app, you might call backend to invalidate token
  return true;
};
