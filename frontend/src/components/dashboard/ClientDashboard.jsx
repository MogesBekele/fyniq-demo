import { useState } from "react";
import FileUpload from "../FileUpload";

export default function ClientDashboard() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const isImage = (filename) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <FileUpload
        onUpload={(file) =>
          setUploadedFiles((prev) => [...prev, file])
        }
      />

      {uploadedFiles.length > 0 && (
        <ul className="mt-4">
          {uploadedFiles.map((file) => (
            <li key={file.id} className="mb-4 border p-2 rounded">
              <p className="font-medium">{file.filename} uploaded by {file.uploader}</p>
              {isImage(file.filename) ? (
                <img
                  src={file.data}
                  alt={file.filename}
                  className="w-48 h-auto border rounded mt-2"
                />
              ) : (
                <p className="text-gray-500 mt-2">File uploaded (preview not available)</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
