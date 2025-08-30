// import { useState, useEffect } from "react";
// import { logAction } from "../../utils/auditLogger";
// import { useAuth } from "../../context/useAuth";

// export default function StaffDashboard() {
//   const [files, setFiles] = useState([]);
//   const { logout } = useAuth();

//   useEffect(() => {
//     const storedFiles = JSON.parse(localStorage.getItem("files") || "[]");
//     setFiles(storedFiles);
//   }, []);

//   const handleValidate = (fileName) => {
//     const username = JSON.parse(localStorage.getItem("auth")).username;

//     alert(`Validated ${fileName} ✅`);
//     setFiles((prevFiles) => {
//       const updated = prevFiles.filter((f) => f.filename !== fileName);
//       localStorage.setItem("files", JSON.stringify(updated));
//       return updated;
//     });

//     // Centralized audit logging
//     logAction({ action: "validate", file: fileName, user: username });
//   };

//   const handleLogout = () => {
//     logout();
//     window.location.href = "/";
//   };

//   return (
//     <div className="min-h-screen w-full bg-gray-100 flex flex-col">
//       {/* Header */}
//       <header className="w-full bg-white shadow px-10 py-4 mb-10 flex justify-between items-center sticky top-0 z-10">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
//           Staff Dashboard
//         </h1>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
//         >
//           Logout
//         </button>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 px-6 md:px-20 pb-10">
//         {files.length === 0 ? (
//           <div className="flex justify-center items-center h-full">
//             <p className="text-gray-500 text-lg">No files available.</p>
//           </div>
//         ) : (
//           <div className="grid gap-4 md:gap-6">
//             {/* Desktop Table */}
//             <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
//                     <th className="py-3 px-4">Filename</th>
//                     <th className="py-3 px-4">Uploader</th>
//                     <th className="py-3 px-4">Uploaded At</th>
//                     <th className="py-3 px-4 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {files.map((file, idx) => (
//                     <tr
//                       key={file.id || idx}
//                       className={`border-b border-gray-300 ${
//                         idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                       } hover:bg-blue-50 transition`}
//                     >
//                       <td className="py-3 px-4 break-words">{file.filename}</td>
//                       <td className="py-3 px-4">{file.uploader}</td>
//                       <td className="py-3 px-4">
//                         {new Date(file.uploadedAt).toLocaleString()}
//                       </td>
//                       <td className="py-3 px-4 text-center">
//                         <button
//                           onClick={() => handleValidate(file.filename)}
//                           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
//                         >
//                           Validate
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Cards */}
//             <div className="md:hidden flex flex-col gap-4">
//               {files.map((file) => (
//                 <div
//                   key={file.id}
//                   className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
//                 >
//                   <p className="font-semibold text-gray-800 break-words">
//                     📄 {file.filename}
//                   </p>
//                   <p className="text-gray-500 text-sm">
//                     Uploader: {file.uploader}
//                   </p>
//                   <p className="text-gray-400 text-sm">
//                     Uploaded: {new Date(file.uploadedAt).toLocaleString()}
//                   </p>
//                   <button
//                     onClick={() => handleValidate(file.filename)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow transition mt-2"
//                   >
//                     Validate
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

export default function StaffDashboard() {
  const [files, setFiles] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/files");
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files", err);
      }
    };
    fetchFiles();
  }, []);

  const handleAction = async (fileId, action) => {
    const username = JSON.parse(localStorage.getItem("auth")).username;

    try {
      const res = await axios.post(
        `http://localhost:4000/api/files/action/${fileId}`,
        { username, action }
      );

      const updatedFile = res.data.file;
      setFiles((prev) => prev.map((f) => (f._id === fileId ? updatedFile : f)));

      alert(res.data.message);
    } catch (err) {
      console.error(`${action} failed`, err);
      alert(`Action "${action}" failed`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    logout();
    window.location.href = "/";
  };

  const renderActionButtons = (file) => {
    if (file.status === "approved")
      return <span className="text-green-600 font-semibold">Approved ✅</span>;
    if (file.status === "rejected")
      return <span className="text-red-600 font-semibold">Rejected ❌</span>;

    return (
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => handleAction(file._id, "approve")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction(file._id, "reject")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Reject
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow px-10 py-4 mb-10 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          Staff Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <a
            href="/logs"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow transition"
          >
            View Logs
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-20 pb-10">
        {files.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-lg">No files available.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                    <th className="py-3 px-4">Filename</th>
                    <th className="py-3 px-4">Uploader</th>
                    <th className="py-3 px-4">Uploaded At</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, idx) => (
                    <tr
                      key={file._id}
                      className={`border-b border-gray-300 ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="py-3 px-4 break-words">{file.originalName}</td>
                      <td className="py-3 px-4">{file.uploader}</td>
                      <td className="py-3 px-4">{new Date(file.uploadedAt).toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">{renderActionButtons(file)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-4">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
                >
                  <p className="font-semibold text-gray-800 break-words">📄 {file.originalName}</p>
                  <p className="text-gray-500 text-sm">Uploader: {file.uploader}</p>
                  <p className="text-gray-400 text-sm">Uploaded: {new Date(file.uploadedAt).toLocaleString()}</p>
                  {renderActionButtons(file)}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
