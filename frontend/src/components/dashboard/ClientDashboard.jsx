import { useState } from "react";
import FileUpload from "../FileUpload";

export default function ClientDashboard() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow px-10 py-4 mb-10  flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          Client Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-lg shadow transition hover:cursor-pointer"
        >
          Logout
        </button>
      </header>

      {/* File Upload Section */}
      <FileUpload
        onUpload={(file) => setUploadedFiles((prev) => [...prev, file])}
      />

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="m-20">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className=" justify-between flex border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium text-gray-800 ">
                📄 {file.filename}{" "}
            
              
              </p>
                  <button onClick={() => setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id))}>Delete</button>
            </div>
            
          ))}
        
        </div>
      )}
    </div>
  );
}
