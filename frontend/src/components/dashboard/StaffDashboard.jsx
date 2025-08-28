import { useState, useEffect } from "react";
import { getFiles } from "../../services/fileService";

export default function StaffDashboard() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    getFiles().then(setFiles);
  }, []);

  const handleValidate = (fileName) => {
    alert(`Validated ${fileName} ✅`);
    // Optional: remove validated file
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== fileName));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
      <ul>
        {files.map((file, idx) => (
          <li key={idx} className="flex justify-between items-center mb-2">
            <span>{file.name}</span>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => handleValidate(file.name)}
            >
              Validate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
