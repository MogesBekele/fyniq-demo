import { useState } from "react";

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpload = () => {
    if (!file) return alert("Select a file");

    const reader = new FileReader();

    reader.onload = () => {
      const existingFiles = JSON.parse(localStorage.getItem("files") || "[]");

      const newFile = {
        id: Date.now(),
        filename: file.name,
        uploader: user.username,
        role: user.role,
        uploadedAt: new Date().toISOString(),
        data: reader.result,
      };

      localStorage.setItem("files", JSON.stringify([...existingFiles, newFile]));

      // Audit log
      const logs = JSON.parse(localStorage.getItem("logs") || "[]");
      logs.push({
        id: Date.now(),
        action: "upload",
        file: newFile.filename,
        user: user.username,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("logs", JSON.stringify(logs));

      if (onUpload) onUpload(newFile);

      // Reset file input after a short delay
      setTimeout(() => {
        setFile(null);
        setProgress(0);
        alert("Upload successful ✅");
      }, 500);
    };

    // Simulate progress visually
    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += Math.floor(Math.random() * 15) + 5; // random step
      if (fakeProgress >= 100) fakeProgress = 100;
      setProgress(fakeProgress);
      if (fakeProgress === 100) {
        clearInterval(interval);
        reader.readAsDataURL(file); // read file after progress finishes
      }
    }, 100);
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Upload
      </button>

      {progress > 0 && (
        <div className="mt-2 w-full bg-gray-300 h-4 rounded">
          <div
            className="bg-blue-500 h-4 rounded transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
