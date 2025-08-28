import { useState, useEffect } from "react";


import FileUpload from "../FileUpdoad";
import { getFiles } from "../../services/fileService";

export default function ClientDashboard() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    getFiles().then((files) => setUploadedFiles(files.map(f => f.name)));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
      <FileUpload onUpload={(fileName) => setUploadedFiles([...uploadedFiles, fileName])} />
      <ul className="mt-4">
        {uploadedFiles.map((file, idx) => (
          <li key={idx}>{file}</li>
        ))}
      </ul>
    </div>
  );
}
