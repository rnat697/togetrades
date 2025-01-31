// socket.js
import { Server } from "socket.io";

let io;

let onlineUsers = [];

const addNewUser = (username, userId, socketId) => {
  console.log(socketId);
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ username, userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

export const getUser = (userId) => {
  console.log(userId);
  console.log(onlineUsers.find((user) => user.userId === userId));
  return onlineUsers.find((user) => user.userId === userId);
};

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
    // listens to event to add new users
    socket.on("newUser", (username, userId) => {
      addNewUser(username, userId, socket.id);
      console.log(`New online user added: ${username} (ID: ${userId})`);
      console.log(`online users:`);
      console.log(onlineUsers);
    });

    socket.on("connect_error", (err) =>
      console.error("Connection error:", err)
    );

    socket.on("disconnect", () => {
      console.log("A user has disconnected");
      removeUser(socket.id);
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
