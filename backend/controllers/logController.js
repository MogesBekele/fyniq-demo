// backend/controllers/logController.js
import Log from "../models/Log.js";

// backend/controllers/logController.js
export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }); // 👈 use timestamp
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
