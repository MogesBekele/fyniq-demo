import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("client");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(username, role);
    if (!user) return;
    if (user.role === "client") navigate("/client");
    else if (user.role === "staff") navigate("/staff");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-4 w-full"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          <option value="client">Client</option>
          <option value="staff">Staff</option>
        </select>
        <button className="bg-blue-500 text-white p-2 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
}
