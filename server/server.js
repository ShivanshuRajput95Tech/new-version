require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profileRoutes = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const peopleRoutes = require("./routes/peopleRoutes");
const platformRoutes = require("./routes/platformRoutes");
const limiter = require("./middleware/ratelimit");

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(compression());
app.use(limiter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "chat-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/people", peopleRoutes);
app.use("/api/platform", platformRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }
  return res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));

  try {
    const jwt = require("jsonwebtoken");
    const userData = jwt.verify(token, process.env.JWTPRIVATEKEY);
    socket.userId = userData._id;
    return next();
  } catch {
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  onlineUsers.set(socket.userId, socket.id);
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));

  socket.on("sendMessage", (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", {
        senderId: socket.userId,
        message: data.message,
      });
    }
  });

  socket.on("typing", (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("userTyping", { senderId: socket.userId });
    }
  });

  socket.on("stopTyping", (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("userStopTyping", { senderId: socket.userId });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.userId);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});
