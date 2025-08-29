import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ["client", "staff"], required: true },
  password: { type: String, required: true },
  passwordHash: { type: String }, // for real apps, hash passwords
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
