import { useEffect, useState } from "react";
import axios from "axios";


export default function AdminLogs() {
  const [logs, setLogs] = useState([]);


  // Helper to safely format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date));
  };

  // Fetch logs from backend
  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/logs");
      // Sort newest first
      setLogs(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleBack = () => {
    window.location.href = "/staff";
  };



  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow px-10 py-4 mb-10 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          Audit Logs
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchLogs}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Refresh
          </button>
          <button
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Back
          </button>
     
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-20 pb-10">
        {logs.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-lg">No logs available.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
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
                      className={`border-b border-gray-300 ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="py-3 px-4 capitalize">{log.action}</td>
                      <td className="py-3 px-4 break-words">{log.file}</td>
                      <td className="py-3 px-4">{log.user}</td>
                      <td className="py-3 px-4">{formatDate(log.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
                >
                  <p className="font-semibold capitalize text-gray-800">
                    Action: {log.action}
                  </p>
                  <p className="text-gray-500 text-sm break-words">
                    File: {log.file}
                  </p>
                  <p className="text-gray-500 text-sm">User: {log.user}</p>
                  <p className="text-gray-400 text-sm">
                    Time: {formatDate(log.createdAt)}
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
