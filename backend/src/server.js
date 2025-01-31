import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT ?? 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// HTTP and WebSocket Server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST"],
    credentials: true,
  },
});

// Database connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Connection Error:", err));

// Routes
import api from "./routes/index.js";
app.use("/api/v1", api);

// WebSocket Events
io.on("connection", (socket) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.log("No token provided. Disconnecting...");
    socket.disconnect();
    return;
  }
  console.log("A user has logged on");

  socket.on("disconnect", () => {
    console.log("Someone has left");
  });
  socket.on("connect_error", (err) => console.error("Connection error:", err));
});

// Start server
httpServer.listen(port, () => console.log(`Server listening on port ${port}!`));
