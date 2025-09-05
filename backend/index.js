import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import connectDB from "./config/db.js";
import logRoutes from "./routes/logRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*" }));


app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/logs", logRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
