// src/services/fileService.js

// Mock file upload
export const uploadFile = async (file) => {
  return { success: true, filename: file.name };
};

// Mock fetching uploaded files
export const getFiles = async () => {
  return [
    { id: 1, name: "doc1.pdf" },
    { id: 2, name: "doc2.pdf" },
  ];
};
