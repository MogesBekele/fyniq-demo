import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // 👈 password state
  const [role, setRole] = useState("client");
  const [isRegister, setIsRegister] = useState(false);
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      const path = user.role === "client" ? "/client" : "/staff";
      if (window.location.pathname !== path) {
        navigate(path, { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      const registeredUser = await register(username, password, role);
      if (!registeredUser) return;

      alert("Registration successful! Please login."); // optional
      setIsRegister(false); // switch to login form
      setUsername("");
      setPassword("");
      setRole("client"); // reset role
      return; // do NOT navigate to dashboard
    }

    // Login flow
    const loggedInUser = await login(username, password);
    if (!loggedInUser) return;

    const path = loggedInUser.role === "client" ? "/client" : "/staff";
    navigate(path, { replace: true });
  };

  if (loading) return null;

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col w-full max-w-md"
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">
          {isRegister ? "Register" : "Login"}
        </h2>

        {/* Username */}
        <label className="block mb-2 font-medium text-gray-700">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-xl p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        {/* Password */}
        <label className="block mb-2 font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-xl p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        {/* Role (only for register, optional for login) */}
        {isRegister && (
          <>
            <label className="block mb-2 font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-200 rounded-xl p-3 mb-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="client">Client</option>
              <option value="staff">Staff</option>
            </select>
          </>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 mt-10 rounded-xl shadow-md transition-colors duration-300"
        >
          {isRegister ? "Register" : "Login"}
        </button>

        {/* Toggle link */}
        <p
          onClick={() => setIsRegister(!isRegister)}
          className="mt-6 text-center text-sm text-blue-600 cursor-pointer hover:underline"
        >
          {isRegister
            ? "Already have an account?  Login"
            : "Don't have an account?  Register"}
        </p>
      </form>
    </div>
  );
}
