import { useState } from "react";
import { uploadFile } from "../services/fileService";

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    // Mock upload progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        // call fileService
        uploadFile(file).then((res) => {
          if (onUpload) onUpload(res.filename);
          setFile(null);
          setProgress(0);
        });
      }
    }, 500);
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <input type="file" onChange={handleFileChange} />
      <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpload}>
        Upload
      </button>
      {progress > 0 && (
        <div className="mt-2 w-full bg-gray-300 h-4 rounded">
          <div className="bg-blue-500 h-4 rounded transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
