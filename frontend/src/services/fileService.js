const API_URL = "http://localhost:4000/files";

// Upload a file to backend
export const uploadFile = async (file, user) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("username", user.username); // add username
  formData.append("role", user.role);         // add role

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }

  return res.json(); // returns { success: true, file }
};

// Get all uploaded files from backend
export const getFiles = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch files");
  return res.json(); // returns array of { id, name }
};
