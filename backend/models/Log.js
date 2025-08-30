import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: { type: String, enum: ["upload", "delete", "approve", "reject"], required: true },
  file: { type: String, required: true },
  user: { type: String, required: true },
}, { timestamps: true }); // adds createdAt automatically

export default mongoose.model("Log", logSchema);

