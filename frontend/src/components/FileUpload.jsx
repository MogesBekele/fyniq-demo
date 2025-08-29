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
        reader.readAsDataURL(file);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-lg h-60">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Upload Your File</h3>

      <div className="flex flex-col sm:flex-row items-center w-full gap-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={handleUpload}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          Upload
        </button>
      </div>

      {progress > 0 && (
        <div className="w-full bg-gray-200 h-4 rounded mt-4">
          <div
            className="bg-blue-500 h-4 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
