import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("client");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      navigate(storedUser.role === "client" ? "/client" : "/staff", {
        replace: true,
      });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { username, role };
    localStorage.setItem("user", JSON.stringify(user));
    navigate(role === "client" ? "/client" : "/staff");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col w-full max-w-md"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">
            Login
          </h2>

          <label className="block mb-2 font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <label className="block mb-2 font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-200 rounded-xl p-3 mb-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="client">Client</option>
            <option value="staff">Staff</option>
          </select>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-3 mt-10 rounded-xl shadow-md transition-colors duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
