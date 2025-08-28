import { useState } from "react";

export default function StaffDashboard() {
  const [files, setFiles] = useState(["sample1.pdf", "sample2.pdf"]);

  const handleValidate = (file) => {
    alert(`Validated ${file} ✅`); // Mock API
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
      <ul>
        {files.map((file, idx) => (
          <li key={idx} className="flex justify-between items-center mb-2">
            <span>{file}</span>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => handleValidate(file)}
            >
              Validate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
