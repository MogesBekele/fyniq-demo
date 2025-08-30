import File from "../models/File.js";
import Log from "../models/Log.js";
import { logAction } from "../utils/auditLogger.js";

// Upload file
export const uploadFile = async (req, res) => {
  try {
    const { username, role } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploader: username,
      role,
    });
    await newFile.save();

    await Log.create({ action: "upload", file: newFile.originalName, user: username });
    logAction({ action: "upload", file: newFile.originalName, user: username });

    res.status(201).json({ message: "File uploaded successfully ✅", file: newFile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const { username } = req.body;
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    await Log.create({ action: "delete", file: file.originalName, user: username || "unknown" });
    logAction({ action: "delete", file: file.originalName, user: username || "unknown" });

    res.json({ message: "File deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// POST /api/files/action/:id
export const handleFileAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, action } = req.body;

    if (!username || !action) {
      return res.status(400).json({ error: "Username and action are required" });
    }

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ error: "File not found" });

    if (action === "validate") file.status = "validated";
    else if (action === "reject") file.status = "rejected";
    else return res.status(400).json({ error: "Invalid action" });

    await file.save();

    await Log.create({ action, file: file.originalName, user: username });
    logAction({ action, file: file.originalName, user: username });

    res.json({ message: `File ${file.originalName} ${action}d ✅`, file });
  } catch (error) {
    console.error("File action error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
