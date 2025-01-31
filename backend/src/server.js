import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import mongoose from "mongoose";
import api from "./routes/index.js";
import { initSocket } from "./socket/socket.js"; // Import socket setup

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const httpServer = createServer(app);
const io = initSocket(httpServer); // Initialize and attach Socket.IO

app.use("/api/v1", api);

await mongoose.connect(process.env.DB_URL);

httpServer.listen(port, () =>
  console.log(`App server listening on port ${port}!`)
);
