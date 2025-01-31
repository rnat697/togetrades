// socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("No token provided. Disconnecting...");
      socket.disconnect();
      return;
    }
    console.log("A user has connected");

    socket.on("connect_error", (err) =>
      console.error("Connection error:", err)
    );

    socket.on("disconnect", () => {
      console.log("A user has disconnected");
    });
  });

  return io;
};

export const getSocket = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
