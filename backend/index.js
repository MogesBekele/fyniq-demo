
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import connectDB from "./config/db.js";
import logRoutes from "./routes/logRoutes.js";


dotenv.config(); // <-- load env variables
connectDB();      // connect to MongoDB

const app = express();
const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://fyniq-demo.vercel.app"] // your frontend URL in production
  : ["http://localhost:5173"]; // your frontend URL in development

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
console.log("JWT_SECRET =", process.env.JWT_SECRET);

app.use("/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/logs", logRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
