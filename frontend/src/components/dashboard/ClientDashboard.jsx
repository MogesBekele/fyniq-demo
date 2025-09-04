// import { useState } from "react";
// import FileUpload from "../FileUpload";
// import { useAuth } from "../../context/useAuth";

// export default function ClientDashboard() {
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const {logout} = useAuth();

// const handleLogout=()=>{
//   logout();
//   window.location.href = "/"; // redirect to login page
// }

//   return (
//     <div className="min-h-screen w-full bg-gray-100 flex flex-col">
//       {/* Header */}
//       <header className="w-full bg-white shadow px-10 py-4 mb-10  flex justify-between items-center sticky top-0 z-10">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
//           Client Dashboard
//         </h1>
//         <button
//           onClick={handleLogout}
//           className="bg-gray-200 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-lg shadow transition hover:cursor-pointer"
//         >
//           Logout
//         </button>
//       </header>

//       {/* File Upload Section */}
//       <FileUpload
//         onUpload={(file) => setUploadedFiles((prev) => [...prev, file])}
//       />

//       {/* Uploaded Files */}
//       {uploadedFiles.length > 0 && (
//         <div className="m-20">
//           {uploadedFiles.map((file) => (
//             <div
//               key={file.id}
//               className=" justify-between flex border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
//             >
//               <p className="font-medium text-gray-800 ">
//                 📄 {file.filename}{" "}

//               </p>
//                   <button onClick={() => setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id))}>Delete</button>
//             </div>

//           ))}

//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import FileUpload from "../FileUpload";
import { useAuth } from "../../context/useAuth";
import { toast } from "react-toastify";

export default function ClientDashboard() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { logout, API_URL } = useAuth();

  useEffect(() => {
    // Fetch files on mount
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/files`);
        setUploadedFiles(res.data);
      } catch (err) {
        console.error("Error fetching files", err);
        toast.error("Failed to fetch files ❌");
      }
    };
    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem("auth"));
    try {
      await axios.delete(`${API_URL}/api/files/${id}`, {
        data: { username: user.username },
      });
      setUploadedFiles((prev) => prev.filter((f) => f._id !== id));
      toast.success("File deleted ");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete file");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    logout();
    toast.info("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow px-10 py-4 mb-10 flex justify-between items-center sticky top-0 z-10">
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
        onUpload={(file) => {
          setUploadedFiles((prev) => [...prev, file]);
        }}
      />

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="m-20 space-y-3">
          {uploadedFiles.map((file) => (
            <div
              key={file._id}
              className="flex justify-between border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium text-gray-800">
                📄 {file.originalName}
              </p>
              <button
                onClick={() => handleDelete(file._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
