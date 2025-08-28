import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Login controller
export const login = async (req, res) => {
  const { username, role } = req.body;

  if (!username || !role) {
    return res.status(400).json({ error: "Missing username or role" });
  }

  try {
    let user = await User.findOne({ username });
    if (!user) {
      // Create a new user
      user = await User.create({ username, role });
    } else {
      // Update role if it's different
      if (user.role !== role) {
        user.role = role;
        await user.save();
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ username: user.username, role: user.role, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Optional logout
export const logout = (req, res) => {
  res.json({ success: true, message: "Logged out" });
};
