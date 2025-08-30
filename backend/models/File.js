// models/File.js
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  uploader: { type: String, required: true },
  role: { type: String, enum: ["client", "staff"], required: true },
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

const File = mongoose.model("File", fileSchema);
export default File;
