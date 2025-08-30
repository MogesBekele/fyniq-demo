import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: { type: String, enum: ["upload", "delete", "approve", "reject"], required: true },
  file: { type: String, required: true },  // original filename
  user: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model("Log", logSchema);
export default Log;
