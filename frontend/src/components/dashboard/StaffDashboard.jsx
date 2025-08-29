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
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow px-10 py-4 mb-10  flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          Staff Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-lg shadow transition hover:cursor-pointer"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-20 p-6">
        {files.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-lg">No files available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Uploader</th>

                  <th className="max-sm:hidden py-3 px-4">Uploaded At</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, idx) => (
                  <tr
                    key={file.id || idx}
                    className={`border-b border-gray-300 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition hover:cursor-pointer`}
                  >
                    <td className="py-3 px-4 break-words">{file.filename}</td>
                    <td className="py-3 px-4">{file.uploader}</td>

                    <td className="max-sm:hidden py-1 px-2">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleValidate(file.filename)}
                        className="bg-gray-200 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg shadow transition"
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
      </main>
    </div>
  );
}
