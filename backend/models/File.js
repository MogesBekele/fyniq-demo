import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // stored on disk
  originalName: { type: String, required: true },
  uploader: { type: String, required: true }, // username of uploader
  role: { type: String, enum: ["client", "staff"], required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);
export default File;
