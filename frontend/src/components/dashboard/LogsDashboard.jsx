import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const { API_URL } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "N/A"; // fallback if invalid

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/logs`);

      // Sort newest first
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setLogs(sorted);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleBack = () => {
    navigate("/staff");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow px-6 md:px-10 py-4 mb-8 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          Audit Logs
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            className="bg-gray-50 hover:cursor-pointer text-gray-700 px-4 py-2 rounded-lg shadow transition duration-200"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-2 md:px-6 pb-10 w-full overflow-x-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 hover:cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow transition duration-200 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400 text-lg">No logs available.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white shadow rounded-lg border border-gray-200 mx-auto w-11/12 max-w-4xl overflow-x-auto ">
              <table className="w-full table-auto text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm tracking-wider">
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">File</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => (
                    <tr
                      key={log._id}
                      className={`border-b border-gray-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="py-3 px-4 capitalize font-medium text-gray-700">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 break-all">{log.file}</td>
                      <td className="py-3 px-4 break-words">{log.user}</td>
                      <td className="py-3 px-4 break-words">
                        {log.timestamp ? formatDate(log.timestamp) : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4 w-full">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-1 hover:shadow-lg transition"
                >
                  <p className="font-semibold capitalize text-gray-800">
                    Action: {log.action}
                  </p>
                  <p className="text-gray-600 text-sm break-words">
                    File: {log.file}
                  </p>
                  <p className="text-gray-600 text-sm">User: {log.user}</p>
                  <p className="text-gray-500 text-sm">
                  {log.timestamp ? formatDate(log.timestamp) : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
