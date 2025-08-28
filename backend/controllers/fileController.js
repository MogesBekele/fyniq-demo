import File from "../models/File.js";

// Get all files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

// Upload a file
export const uploadFile = async (req, res) => {
  if (!req.file || !req.body.username || !req.body.role) {
    return res.status(400).json({ error: "Missing file or user info" });
  }

  try {
    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploader: req.body.username,
      role: req.body.role,
    });
    await newFile.save();
    res.json({ success: true, file: newFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload file" });
  }
};
