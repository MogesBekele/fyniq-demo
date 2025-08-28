
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import connectDB from "./config/db.js";

dotenv.config(); // <-- load env variables
connectDB();      // connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
console.log("JWT_SECRET =", process.env.JWT_SECRET);

app.use("/auth", authRoutes);
app.use("/files", fileRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
