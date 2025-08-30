import express from "express";
import Log from "../models/Log.js";

const router = express.Router();

// Get all logs (most recent first)
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
