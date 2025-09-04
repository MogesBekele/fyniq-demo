import {useAuth} from "../context/AuthProvider";



// Real login function
export const login = async (username, role) => {
  const {API_URL} = useAuth();
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data; // { username, role, token }
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
};

// Real logout function
export const logout = async () => {
  // Optional: call backend to invalidate token if needed
  return true;
};
