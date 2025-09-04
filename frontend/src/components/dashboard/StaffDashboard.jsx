import { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify"; 
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";

export default function StaffDashboard() {
  const [files, setFiles] = useState([]);
  const { logout, API_URL } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true); // start loading
        const res = await axios.get(`${API_URL}/api/files`);
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files", err);
        toast.error("Failed to fetch files ❌");
      } finally {
        setLoading(false); // stop loading
      }
    };
    fetchFiles();
  }, []);

  // Fetch files on mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/files`);
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files", err);
        toast.error("Failed to fetch files ❌");
      }
    };
    fetchFiles();
  }, []);

  // Handle approve/reject actions
  const handleAction = async (fileId, action) => {
    try {
      // Stubbed API call (mock)
      await new Promise((resolve) => setTimeout(resolve, 500));

      setFiles((prev) =>
        prev.map((f) =>
          f._id === fileId
            ? { ...f, status: action === "approve" ? "approved" : "rejected" }
            : f
        )
      );

      toast.success(`${action === "approve" ? "Validated" : "Rejected"}`);
    } catch (err) {
      console.error(`${action} failed`, err);
      toast.error(`Action "${action}" failed `);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    logout();
    toast.info("Logged out successfully");
    window.location.href = "/";
  };

  // Render action buttons based on file status
  const renderActionButtons = (file) => {
    if (file.status === "approved")
      return <span className="text-green-600 font-semibold">Validated</span>;
    if (file.status === "rejected")
      return <span className="text-red-600 font-semibold">Rejected</span>;

    return (
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => handleAction(file._id, "approve")}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg shadow transition"
        >
          Validate
        </button>
        <button
          onClick={() => handleAction(file._id, "reject")}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow transition"
        >
          Reject
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow px-10 py-4 mb-10 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl md:text-3xl font-bold text-gray-700 ">
          Staff Dashboard
        </h1>
        <div className="flex max-sm:flex-col items-center gap-4 ">
          <Link
            to="/logs"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow transition max-sm:hidden"
          >
            View Logs
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow transition hover:cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-20 pb-10">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-lg">No files available.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:gap-6">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                      <th className="py-3 px-4">Filename</th>
                      <th className="py-3 px-4">Uploader</th>
                      <th className="py-3 px-4">Uploaded At</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, idx) => (
                      <tr
                        key={file._id}
                        className={`border-b border-gray-300 ${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50 transition`}
                      >
                        <td className="py-3 px-4 break-words">
                          {file.originalName}
                        </td>
                        <td className="py-3 px-4">{file.uploader}</td>
                        <td className="py-3 px-4">
                          {new Date(file.uploadedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {renderActionButtons(file)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link
                to="/logs"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 mb-6 w-30 rounded-lg shadow transition sm:hidden"
              >
                View Logs
              </Link>

              {/* Mobile Cards */}
              <div className="md:hidden flex flex-col gap-4">
                {files.map((file) => (
                  <div
                    key={file._id}
                    className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
                  >
                    <p className="font-semibold text-gray-800 break-words">
                      📄 {file.originalName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Uploader: {file.uploader}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                    {renderActionButtons(file)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
