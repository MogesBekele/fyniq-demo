import express from "express";
import multer from "multer";
import { getFiles, uploadFile } from "../controllers/fileController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Fetch all uploaded files
router.get("/", getFiles);

// Upload a file
router.post("/upload", upload.single("file"), uploadFile);

export default router;
