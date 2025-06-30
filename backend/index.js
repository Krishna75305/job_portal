import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS: allow frontend domain
const corsOptions = {
  origin: 'https://job-portal-1-p73h.onrender.com', // your frontend
  credentials: true,
};
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Serve frontend
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
