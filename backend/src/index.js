import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config();
const app = express();

// ✅ Setup allowed origins for CORS
// Fallback to localhost for development if FRONTEND_URLS not set
const allowedOrigins = (process.env.FRONTEND_URLS || "http://localhost:5173").split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: Origin ${origin} not allowed`));
      }
    },
    credentials: true, // Allow cookies to be sent
  })
);

// ✅ Handle preflight requests (OPTIONS)
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("hello guys welcome to leetlab🪄");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
