import express from "express";
import multer from "multer";
import { uploadFile, getFiles, deleteFile, handleFileAction } from "../controllers/fileController.js";

const router = express.Router();

// Save uploaded files in /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getFiles);
router.delete("/:id", deleteFile);

// Handle approve/reject actions
router.post("/action/:id", handleFileAction);

export default router;
