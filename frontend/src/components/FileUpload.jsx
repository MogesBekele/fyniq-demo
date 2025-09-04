import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRef } from "react";
import { useAuth } from "../context/AuthProvider";

export default function FileUpload({ onUpload }) {
   const inputRef = useRef(null)
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
 const { API_URL } = useAuth();

  const user = JSON.parse(localStorage.getItem("auth"));

  const handleUpload = async () => {
    if (!file) return toast.warn("Select a file first!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", user.username);
    formData.append("role", user.role);

    // Simulate progress in steps
    setProgress(0);
    const steps = [25, 50, 75, 100];
    let stepIndex = 0;

    const interval = setInterval(() => {
      setProgress(steps[stepIndex]);
      stepIndex++;
      if (stepIndex >= steps.length) clearInterval(interval);

      // Show toast when reaching 100%
      if (steps[stepIndex - 1] === 100) {
        toast.success(`uploaded successfully`);
      }
    }, 300);

    try {
      const res = await axios.post(
        `${API_URL}/api/files/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (onUpload) onUpload(res.data.file);

      setTimeout(() => {
        setFile(null);

        setProgress(0);
      }, 1300); // slightly longer to match fake progress
      inputRef.current.value = ''
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setProgress(0);
      toast.error("Upload failed ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-lg h-60">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Upload Your File
      </h3>

      <div className="flex flex-col sm:flex-row items-center w-full gap-3">
        <input
          type="file"
          ref={inputRef}
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
        <div className="w-full bg-gray-200 h-4 rounded mt-4 relative">
          <div
            className="bg-blue-500 h-5 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <span className="absolute right-2 top-0 text-sm text-gray-700">
            {progress}%
          </span>
        </div>
      )}
    </div>
  );
}


// ----------------------------
// MOCK FILE UPLOAD (CLIENT SIDE)
// ----------------------------
// This simulates uploading a file to the server without a real backend.
// Useful for demo purposes or when backend is not ready.

// export const mockFileUpload = async (file, user) => {
//   console.log(`Mock upload called for file: ${file.name}, user: ${user.username}`);

//   return new Promise((resolve, reject) => {
//     // Simulate a progress-like delay
//     const steps = [25, 50, 75, 100];
//     let stepIndex = 0;

//     const interval = setInterval(() => {
//       console.log(`Progress: ${steps[stepIndex]}%`);
//       stepIndex++;
//       if (stepIndex >= steps.length) clearInterval(interval);
//     }, 300); // 300ms per step

//     // Simulate final API response after 1.2s
//     setTimeout(() => {
//       resolve({
//         status: 200,
//         message: `File "${file.name}" uploaded successfully (mock).`,
//         file: {
//           id: Date.now(),
//           originalName: file.name,
//           uploader: user.username,
//           role: user.role,
//           uploadedAt: new Date().toISOString(),
//           status: "pending",
//         },
//       });
//     }, 1300);
//   });
// };

/* 
Usage Example:

import { mockFileUpload } from './mockFileUpload';

const handleUpload = async () => {
  if (!file) return alert("Select a file first!");

  try {
    const res = await mockFileUpload(file, user);
    if (onUpload) onUpload(res.file);
    alert(res.message);
    setFile(null);
    setProgress(0);
  } catch (err) {
    console.error("Upload failed", err);
    alert("Upload failed ❌");
  }
};
*/
