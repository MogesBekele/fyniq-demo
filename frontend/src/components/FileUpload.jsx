// src/components/FileUpload.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:4000/files/upload", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      if (onUpload) onUpload(res.data.filename);
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpload}>
        Upload
      </button>
      {progress > 0 && (
        <div className="mt-2 w-full bg-gray-300 h-4 rounded">
          <div
            className="bg-blue-500 h-4 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
