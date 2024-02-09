const express = require("express");
const mongoose = require("mongoose");
const connectToDatabase = require("./config/db.config");
require("dotenv").config();
const cors = require("cors");
const app = express();
const socketIo = require("socket.io");
const userRouter = require("./routes/userRoutes");
const http = require("http");
const userModel = require("./models/userModel");
const server = http.createServer(app);
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", userRouter);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
  },
});
const onlineUsers = new Set();
io.on("connection", async (socket) => {
  socket.use((packet, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      socket.userId = token;
      return next();
    }
    return next(new Error("Unauthorized"));
  });

  socket.on("online", (userId) => {
    // console.log(`user with ${userId} is online`);
    onlineUsers.add(userId);
    io.emit("updateOnlineUsers", Array.from(onlineUsers));
  });
  socket.on("disconnect", () => {
    if (socket.userId) {
      console.log("a user disconnected with", socket.userId);
      onlineUsers.delete(socket.userId);
      io.emit("updateOnlineUsers", Array.from(onlineUsers));
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`server started on port ${PORT}`);
  await connectToDatabase();
});
