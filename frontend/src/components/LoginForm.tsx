import { useState } from "react";
import { useAuth } from "../context/UseAuth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("client");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(username, role);

    // Redirect based on role
    if (user.role === "client") navigate("/client");
    else if (user.role === "staff") navigate("/staff");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 mb-4 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <select
          className="border p-2 mb-4 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="client">Client</option>
          <option value="staff">Staff</option>
        </select>
        <button className="bg-blue-500 text-white p-2 w-full rounded">Login</button>
      </form>
    </div>
  );
}
