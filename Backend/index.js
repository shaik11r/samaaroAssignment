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

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    socket.userId = token;
    return next();
  }
});

io.on("connection", async (socket) => {
  // console.log("a user connected with userId", socket.userId);

  socket.on("userStatus", async ({ userId, status }) => {
    await userModel.findByIdAndUpdate({ _id: userId }, { $set: { onlineStatus: status } });
  });
  socket.on("disconnect", async () => {
    await userModel.findByIdAndUpdate(
      { _id: socket.userId },
      { $set: { onlineStatus: "offline" } }
    );
    // console.log("a user disconnected with", socket.userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`server started on port ${PORT}`);
  await connectToDatabase();
});
