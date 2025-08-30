// backend/controllers/logController.js
import Log from "../models/Log.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }); // newest first
    res.json(logs); // should include createdAt automatically
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
