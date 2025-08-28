import { useState, useEffect } from "react";

export default function StaffDashboard() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("files") || "[]");
    setFiles(storedFiles);
  }, []);

  const handleValidate = (fileName) => {
    alert(`Validated ${fileName} ✅`);
    setFiles((prevFiles) => {
      const updated = prevFiles.filter((f) => f.filename !== fileName);
      localStorage.setItem("files", JSON.stringify(updated));
      return updated;
    });

    // Audit logging
    const logs = JSON.parse(localStorage.getItem("logs") || "[]");
    logs.push({
      id: Date.now(),
      action: "validate",
      file: fileName,
      user: JSON.parse(localStorage.getItem("user")).username,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("logs", JSON.stringify(logs));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-row  mb-6 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Staff Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Table or Empty State */}
      {files.length === 0 ? (
        <p className="text-gray-500 text-lg">No files available.</p>
      ) : (
        <div className="overflow-x-auto w-full flex-1">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="py-3 px-4 text-left">Filename</th>
                <th className="py-3 px-4 text-left">Uploader</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Uploaded At</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 break-words">{file.filename}</td>
                  <td className="py-3 px-4">{file.uploader}</td>
                  <td className="py-3 px-4">
                    {file.role.charAt(0).toUpperCase() + file.role.slice(1)}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(file.uploadedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleValidate(file.filename)}
                      className="bg-black text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Validate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
