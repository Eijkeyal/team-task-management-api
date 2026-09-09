import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Access token is required"));
      }

      const decoded = verifyAccessToken(token);

      if (!decoded) {
        return next(new Error("Invalid or expired access token"));
      }

      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.user.id}`);

    // Join user's private room
    socket.join(`user:${socket.user.id}`);

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
