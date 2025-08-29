import { useState, useEffect } from "react";
import { logAction } from "../../utils/auditLogger";
import { useAuth } from "../../context/useAuth";

export default function StaffDashboard() {
  const [files, setFiles] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("files") || "[]");
    setFiles(storedFiles);
  }, []);

  const handleValidate = (fileName) => {
    const username = JSON.parse(localStorage.getItem("auth")).username;

    alert(`Validated ${fileName} ✅`);
    setFiles((prevFiles) => {
      const updated = prevFiles.filter((f) => f.filename !== fileName);
      localStorage.setItem("files", JSON.stringify(updated));
      return updated;
    });

    // Centralized audit logging
    logAction({ action: "validate", file: fileName, user: username });
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow px-10 py-4 mb-10 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          Staff Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-20 pb-10">
        {files.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-lg">No files available.</p>
          </div>
        ) : (
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
                      key={file.id || idx}
                      className={`border-b border-gray-300 ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="py-3 px-4 break-words">{file.filename}</td>
                      <td className="py-3 px-4">{file.uploader}</td>
                      <td className="py-3 px-4">
                        {new Date(file.uploadedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleValidate(file.filename)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                        >
                          Validate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
                >
                  <p className="font-semibold text-gray-800 break-words">
                    📄 {file.filename}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Uploader: {file.uploader}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleValidate(file.filename)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow transition mt-2"
                  >
                    Validate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
