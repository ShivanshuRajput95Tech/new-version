# Chat App V1.2 - Complete Code Documentation

**Generated:** March 10, 2026  
**Project:** Chat Application - Full Stack (Node.js + React)  
**Repository:** Chat_appV1.2

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Server Documentation](#server-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [API Endpoints](#api-endpoints)
6. [Environment Configuration](#environment-configuration)
7. [Setup & Deployment](#setup--deployment)

---

## Project Overview

Chat App V1.2 is a full-stack real-time chat application built with:
- **Frontend:** React 18+ with Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Cache:** Redis
- **Real-time Communication:** WebSocket
- **Authentication:** JWT

**Key Features:**
- User authentication & registration
- Real-time messaging
- Online user presence
- Message reactions & interactions
- Profile management
- Avatar selection
- Group chat support

---

## Architecture & Structure

### Directory Layout

\`\`\`
Chat_appV1.2/
├── frontend/                    # React application
│   ├── src/
│   │   ├── api/               # API integration layer
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context for state
│   │   ├── store/             # State management (Zustand/Redux)
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   ├── styles/            # CSS/Tailwind
│   │   └── sockets/           # WebSocket client
│   └── package.json
│
├── server/                      # Node.js backend
│   ├── controllers/            # Request handlers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Express middleware
│   ├── services/               # Business logic
│   ├── sockets/                # WebSocket server
│   ├── config/                 # Configuration files
│   └── package.json
│
├── .env                        # Environment variables
├── Procfile                    # Deployment configuration
└── README.md                   # Project documentation

\`\`\`


## Server Documentation

### Server Entry Point

```javascript
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const path = require("path");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profileRoutes = require("./routes/profileRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const limiter = require("./middleware/ratelimit");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(compression());
app.use(limiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/uploads", uploadRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.status || 500).json({ 
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
    });
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
});

// Socket.io Configuration
const io = new Server(server, {
    cors: corsOptions,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
});

const onlineUsers = new Map();

// Socket authentication middleware
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            return next(new Error('Authentication error: Missing token'));
        }

        const userData = jwt.verify(token, process.env.JWTPRIVATEKEY);
        socket.userId = userData._id;
        socket.userEmail = userData.email;
        next();
    } catch (error) {
        console.error("Socket Auth Error:", error.message);
        next(new Error('Authentication error: Invalid token'));
    }
});

```

### Controllers

#### authController.js

```javascript
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, validateRegister, validateLogin } = require("../models/User");

exports.register = async(req, res) => {

    try {

        const { error } = validateRegister(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            emailVerified: false
        });

        await user.save();

        const secret = process.env.JWTPRIVATEKEY + user.password;

        const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '1h' });

        res.status(201).json({ message: "User registered successfully. Please verify your email.", verificationLink: `http://localhost:5173/verify/${user._id}/${token}` });

    } catch (error) {

        res.status(500).json({ message: "Server error" });

    }

};
exports.login = async(req, res) => {

\n... [file continues] ...
```

#### avatarController.js

```javascript
const Avatar = require("../models/Avatar");

exports.createAvatar = async(req, res) => {

    try {

        const { link } = req.body;

        const avatar = new Avatar({ link });

        await avatar.save();

        res.json({
            message: "Avatar added",
            avatar
        });

    } catch (error) {

        res.status(500).json({ message: "Server error" });

    }

};

exports.getAvatars = async(req, res) => {

    const avatars = await Avatar.find();

    res.json(avatars);

};\n... [file continues] ...
```

#### messageController.js

```javascript
const Message = require("../models/Message");
const { User } = require("../models/User");
const redisClient = require("../config/redis");

exports.getMessages = async(req, res) => {
    const { userId } = req.params;
    const { channel = "general", limit = 50, offset = 0 } = req.query;

    const ourUserId = req.user._id;
    const cacheKey = `messages:${ourUserId}:${userId}:${channel}:${limit}:${offset}`;

    try {
        // Check cache first
        const cachedMessages = await redisClient.get(cacheKey);
        if (cachedMessages) {
            return res.json(JSON.parse(cachedMessages));
        }

        // Mark messages from the other user as read
        await Message.updateMany({
            sender: userId,
            recipient: ourUserId,
            read: false,
            channel: channel
        }, {
            read: true,
            $push: {
                readBy: {
                    user: ourUserId,
                    readAt: new Date()
                }
            }
        });

        const messages = await Message.find({
            $or: [
                { sender: ourUserId, recipient: userId, channel: channel },
                { sender: userId, recipient: ourUserId, channel: channel }
            ]
        })
        .populate("sender", "username avatar")
        .populate("recipient", "username avatar")
        .populate("readBy.user", "username")
        .sort({ createdAt: 1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset));

        // Cache for 5 minutes
        await redisClient.setEx(cacheKey, 300, JSON.stringify(messages));

\n... [file continues] ...
```

#### peopleController.js

```javascript
const { User } = require("../models/User");

exports.getPeople = async(req, res) => {

    const users = await User.find();

    res.json(users);

};\n... [file continues] ...
```

#### profileController.js

```javascript
const { User } = require("../models/User");

exports.getProfile = async(req, res) => {

    const user = await User.findById(req.user._id);

    res.json(user);

};

exports.updateProfile = async(req, res) => {

    const { firstName, lastName, avatarLink } = req.body;

    const user = await User.findById(req.user._id);

    user.firstName = firstName;
    user.lastName = lastName;
    user.avatarLink = avatarLink;

    await user.save();

    res.json(user);

};

exports.updateStatus = async(req, res) => {

    const { status } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, { status }, { new: true });

    res.json(user);

};\n... [file continues] ...
```


### Database Models

#### Avatar.js

```javascript
const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({

    link: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("Avatar", avatarSchema);```

#### Message.js

```javascript
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    channel: {
        type: String,
        default: "general"
    },

    text: {
        type: String,
        required: true
    },

    messageType: {
        type: String,
        enum: ["text", "image", "file", "voice", "system"],
        default: "text"
    },

    attachments: [{
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        url: String,
        thumbnailUrl: String
    }],

    reactions: [{
        emoji: String,
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        count: {
            type: Number,
            default: 0
        }
    }],

    threadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },

    replyCount: {
        type: Number,
        default: 0
    },

    edited: {
        type: Boolean,
        default: false
    },

    editedAt: Date,

    read: {
        type: Boolean,
        default: false
    },

    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }]

}, { timestamps: true });

messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ recipient: 1, read: 1 });
messageSchema.index({ channel: 1, createdAt: -1 });
messageSchema.index({ threadId: 1 });

module.exports = mongoose.model("Message", messageSchema);```

#### User.js

```javascript
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Available"
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Generate authentication token
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
    },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" }
    );
    return token;
};

// Validate registration data
const validateRegister = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().min(6).required().label("Password"),
    });
    return schema.validate(data);
};

// Validate login data
const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validateRegister, validateLogin };
module.exports.User = User;```


### API Routes

#### authRoutes.js

```javascript
const express = require("express");

const router = express.Router();

const {
    register,
    login,
    verifyEmail
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.get("/:id/verify/:token", verifyEmail);

module.exports = router;```

#### avatarRoutes.js

```javascript
const express = require("express");

const router = express.Router();

const {
    createAvatar,
    getAvatars
} = require("../controllers/avatarController");

router.post("/", createAvatar);

router.get("/", getAvatars);

module.exports = router;```

#### messageRoutes.js

```javascript
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMessages,
    sendMessage,
    addReaction,
    getThreadMessages,
    editMessage,
    deleteMessage,
    getUnreadCounts
} = require("../controllers/messageController");

router.get("/:userId", authMiddleware, getMessages);
router.post("/", authMiddleware, sendMessage);
router.post("/reaction", authMiddleware, addReaction);
router.get("/thread/:threadId", authMiddleware, getThreadMessages);
router.put("/:messageId", authMiddleware, editMessage);
router.delete("/:messageId", authMiddleware, deleteMessage);
router.get("/unread/counts", authMiddleware, getUnreadCounts);

module.exports = router;```

#### profileRoutes.js

```javascript
const express = require("express");
const { updateProfile, updateStatus } = require("../controllers/profileController");
const protect = require("../middleware/protect");

const router = express.Router();

router.put("/update", protect, updateProfile);
router.put("/status", protect, updateStatus);

module.exports = router;```

#### uploadRoutes.js

```javascript
// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/upload");

// Serve uploaded files statically
router.use("/files", express.static(path.join(__dirname, "../uploads")));

// Single file upload
router.post("/single", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/api/uploads/files/${req.file.filename}`;
    const relativePath = path.relative(path.join(__dirname, "../uploads"), req.file.path);

    res.json({
        success: true,
        file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: fileUrl,
            path: relativePath
        }
    });
});

// Multiple files upload
router.post("/multiple", upload.array("files", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }

    const files = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/api/uploads/files/${file.filename}`,
        path: path.relative(path.join(__dirname, "../uploads"), file.path)
    }));

    res.json({
        success: true,
        files: files,
        count: files.length
    });
});

// Image upload with thumbnail generation
router.post("/image", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
        // Delete the uploaded file if it's not an image
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Only image files are allowed" });
    }

    const fileUrl = `/api/uploads/files/${req.file.filename}`;

    res.json({
        success: true,
        image: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: fileUrl,
            thumbnailUrl: fileUrl // For now, same as main image
        }
    });
});

// Voice message upload
router.post("/voice", upload.single("audio"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    if (!req.file.mimetype.startsWith("audio/")) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Only audio files are allowed" });
    }

    const fileUrl = `/api/uploads/files/${req.file.filename}`;

    res.json({
        success: true,
        audio: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: fileUrl,
            duration: req.body.duration || null
        }
    });
});

// Delete uploaded file
router.delete("/files/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true, message: "File deleted successfully" });
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

// Get file info
router.get("/files/:filename/info", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        res.json({
            filename: filename,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
        });
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

module.exports = router;```


### Middleware

#### authMiddleware.js

```javascript
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWTPRIVATEKEY
        );

        req.user = decoded;

        next();

    } catch (error) {

        res.status(401).json({ message: "Invalid token" });

    }

};

module.exports = authMiddleware;```

#### errorMiddleware.js

```javascript
const errorMiddleware = (err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        message: "Internal Server Error"
    });

};

module.exports = errorMiddleware;```

#### protect.js

```javascript
const jwt = require("jsonwebtoken");

async function protect(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.authToken;
        if (token) {
            jwt.verify(token, process.env.JWTPRIVATEKEY, {}, (err, userData) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(userData);
                }
            });
        } else {
            reject("no token");
        }
    });
}

module.exports = protect;
```

#### ratelimit.js

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

module.exports = limiter;```

#### upload.js

```javascript
// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration for different file types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = uploadsDir;

        // Create subdirectories for organization
        if (file.mimetype.startsWith("image/")) {
            uploadPath = path.join(uploadsDir, "images");
        } else if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) {
            uploadPath = path.join(uploadsDir, "media");
        } else {
            uploadPath = path.join(uploadsDir, "files");
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension);
        cb(null, `${basename}-${uniqueSuffix}${extension}`);
    }
});

// File filter for security
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
        // Images
        "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
        // Documents
        "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain", "text/csv",
        // Audio/Video
        "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4",
        "video/mp4", "video/avi", "video/mov", "video/wmv",
        // Archives
        "application/zip", "application/x-rar-compressed", "application/x-7z-compressed"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed`), false);
    }
};

// Configure multer with limits for large files
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
        files: 10 // Maximum 10 files per upload
    }
});

// Export different upload configurations
module.exports = {
    single: (fieldName) => upload.single(fieldName),
    array: (fieldName, maxCount) => upload.array(fieldName, maxCount || 10),
    fields: (fields) => upload.fields(fields),
    any: () => upload.any()
};```


## Frontend Documentation

### React Components\n
#### Pages\n
**Chat.jsx**

```jsx
import ChatLayout from "../components/layout/ChatLayout";

export default function Chat() {

  return <ChatLayout />;

}\n... [component continues] ...
```

**ChatHome.jsx**

```jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ChatMessages from "../components/chat/ChatMessages";
import MessageInputForm from "../components/chat/MessageInputForm";
import Nav from "../components/chat/Nav";
import OnlineUsersList from "../components/chat/OnlineUserList";
import TopBar from "../components/chat/TopBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const socketUrl = "ws://localhost:4000";

const ChatHome = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMessage = (ev) => {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  };

  const connectToWebSocket = () => {
    const ws = new WebSocket(socketUrl);
    ws.addEventListener("message", handleMessage);
    setWs(ws);
  };

  const sendMessage = (ev) => {
    if (ev) ev.preventDefault();
    if (newMessage && selectedUserId && ws) {
      ws.send(JSON.stringify({ text: newMessage, recipient: selectedUserId }));
      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          sender: user._id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ]);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
\n... [component continues] ...
```

**Design.jsx**

```jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const Design = () => {
  const [selectedComponent, setSelectedComponent] = useState("button");
  const [customStyles, setCustomStyles] = useState({
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600"
  });
  const [savedDesigns, setSavedDesigns] = useState([
    { id: 1, name: "Blue Button", styles: { backgroundColor: "#3b82f6", color: "#ffffff", borderRadius: "8px", padding: "12px 24px" } },
    { id: 2, name: "Green Card", styles: { backgroundColor: "#10b981", color: "#ffffff", borderRadius: "12px", padding: "16px" } }
  ]);

  const saveDesign = () => {
    const newDesign = {
      id: savedDesigns.length + 1,
      name: `Design ${savedDesigns.length + 1}`,
      styles: customStyles
    };
    setSavedDesigns([...savedDesigns, newDesign]);
  };

  const loadDesign = (design) => {
    setCustomStyles(design.styles);
  };

  const components = [
    { id: "button", name: "Button", icon: "🔘" },
    { id: "card", name: "Card", icon: "📄" },
    { id: "input", name: "Input", icon: "📝" },
    { id: "modal", name: "Modal", icon: "📋" },
    { id: "chat", name: "Chat Bubble", icon: "💬" }
  ];

  const handleStyleChange = (property, value) => {
    setCustomStyles(prev => ({ ...prev, [property]: value }));
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "button":
        return (
          <motion.button
            className="font-semibold transition-all duration-300 hover:scale-105"
            style={customStyles}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Custom Button
          </motion.button>
        );
      case "card":
        return (
          <motion.div
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: customStyles.backgroundColor, color: customStyles.color, borderRadius: customStyles.borderRadius }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl font-bold mb-2">Interactive Card</h3>
            <p>This is a customizable card component with hover effects.</p>
          </motion.div>
        );
      case "input":
        return (
          <motion.input
            type="text"
            placeholder="Type something..."
            className="border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
            style={{
              ...customStyles,
              borderColor: customStyles.backgroundColor,
              borderWidth: "2px"
            }}
            whileFocus={{ scale: 1.02 }}
\n... [component continues] ...
```

**Developer.jsx**

```jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Users,
  MessageCircle,
  TrendingUp,
  Clock,
  BarChart3,
  DollarSign,
  Activity,
  Zap,
  Star,
  Heart,
  Sparkles
} from "lucide-react";

const Developer = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({});
  const [revenue, setRevenue] = useState(0);
  const [researchData, setResearchData] = useState([]);

  useEffect(() => {
    // Mock data for demonstration
    setUserStats({
      totalUsers: 1250,
      activeUsers: 890,
      messagesSent: 45670,
      avgSessionTime: "24m 32s"
    });
    setRevenue(15420.50);
    setResearchData([
      { feature: "Real-time Messaging", usage: 95, feedback: 4.8 },
      { feature: "File Sharing", usage: 78, feedback: 4.6 },
      { feature: "Voice Calls", usage: 45, feedback: 4.3 },
      { feature: "Status Updates", usage: 67, feedback: 4.7 }
    ]);
  }, []);

  const handleGenerateRevenue = () => {
    // Mock revenue generation
    setRevenue(prev => prev + Math.random() * 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
\n... [component continues] ...
```

**Home.jsx**

```jsx
import React from "react";
import Hero from "../components/landing/Hero";
import { useAuth } from "../context/AuthContext";
import LandingNav from "../components/landing/LandingNav";
import Footer from "../components/landing/Footer";
import Features from "../components/landing/Features";
import Payments from "../components/landing/Payments";
import CustomerLogos from "../components/landing/CustomerLogos";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        <LandingNav />
        <Hero />
        <Features />
        <Payments />
        <CustomerLogos />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
\n... [component continues] ...
```

**LoadingDemo.jsx**

```jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import LoadingPage from "../components/LoadingPage";
import { useGlobalLoading } from "../App";
import { loadingConfigs } from "../hooks/useLoading";

const LoadingDemo = () => {
  const [selectedVariant, setSelectedVariant] = useState("default");
  const [showGlobalLoading, setShowGlobalLoading] = useState(false);
  const globalLoading = useGlobalLoading();

  const variants = [
    { id: "default", name: "Default", description: "Classic spinning loader with heart" },
    { id: "pulse", name: "Pulse", description: "Pulsing animated icon" },
    { id: "spinner", name: "Spinner", description: "Dual rotating spinners" },
    { id: "dots", name: "Dots", description: "Bouncing dots animation" },
    { id: "wave", name: "Wave", description: "Audio-style wave bars" },
    { id: "detailed", name: "Detailed", description: "Step-by-step loading with icons" },
    { id: "logo", name: "Logo", description: "Animated logo with glow effect" }
  ];

  const handleGlobalLoadingDemo = async (config) => {
    setShowGlobalLoading(true);
    globalLoading.startLoading(config.message, config.variant);

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 3000));

    globalLoading.stopLoading();
    setShowGlobalLoading(false);
  };

  const handleProgressDemo = async () => {
    globalLoading.startLoading("Processing your request...", "spinner");

    for (let i = 0; i <= 100; i += 10) {
      globalLoading.updateProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    globalLoading.stopLoading();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Loading Page Showcase
          </h1>
          <p className="text-slate-400 text-lg">
            Interactive loading animations for your chat application
          </p>
        </motion.div>

        {/* Global Loading Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Global Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(loadingConfigs).map(([key, config]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGlobalLoadingDemo(config)}
                disabled={showGlobalLoading}
                className="p-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-600/30 transition-all duration-200 text-left disabled:opacity-50"
              >
                <h3 className="font-semibold text-indigo-400 capitalize mb-2">{key.replace(/([A-Z])/g, ' $1')}</h3>
                <p className="text-sm text-slate-400">{config.message}</p>
\n... [component continues] ...
```

**Login.jsx**

```jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useGlobalLoading } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const globalLoading = useGlobalLoading();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();
    const { isAuthenticated, setAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        globalLoading.startLoading("Signing you in...", "pulse");

        try {
            const url = "/api/user/login";
            const response = await axios.post(url, data, {
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Login successful!");
                setAuthenticated(true);
            }
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                toast.error(error.response.data.message || "Login failed");
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            globalLoading.stopLoading();
        }
    };

    const isFormValid = data.email.trim() && data.password.trim();

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)] animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.12),transparent_50%)] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse delay-2000"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
\n... [component continues] ...
```

**Profile.jsx**

```jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Nav from "../components/chat/Nav";
import { useAuth } from "../context/AuthContext";
import SelectAvatar from "../components/SelectAvatar";
import { User, Mail, Save, Sparkles, Heart, Star } from "lucide-react";
import { useGlobalLoading } from "../App";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [selectedLink, setSelectedLink] = useState("");
  const globalLoading = useGlobalLoading();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    globalLoading.startLoading("Updating your profile...", "pulse");

    try {
      const response = await axios.put("/api/profile/update", {
        ...formData,
        avatarLink: selectedLink,
      });
      console.log(response.data);
      // Also update status
      if (formData.status) {
        await axios.put("/api/profile/status", { status: formData.status });
      }
      globalLoading.stopLoading();
    } catch (error) {
      console.error(error);
      globalLoading.stopLoading();
    }
  };

  useEffect(() => {
    setFormData(user);
  }, [user]);

  return (
    <div className="flex min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
\n... [component continues] ...
```

**Register.jsx**

```jsx
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle, XCircle } from "lucide-react";

const Register = () => {
    const [data, setData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });

        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 25) return "bg-red-500";
        if (passwordStrength < 50) return "bg-orange-500";
        if (passwordStrength < 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 25) return "Weak";
        if (passwordStrength < 50) return "Fair";
        if (passwordStrength < 75) return "Good";
        return "Strong";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!acceptTerms) {
            toast.error("Please accept the Terms and Conditions");
            return;
        }

        setIsLoading(true);

        try {
            const url = "/api/user/register";
            const { data: res } = await axios.post(url, data);
            toast.success(res.message || "Registration successful!");
            // Optionally redirect to login or auto-login
        } catch (error) {
            if (error.response && error.response.status >= 300 && error.response.status <= 500) {
                toast.error(error.response.data.message || "Registration failed");
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = data.email.trim() && data.firstName.trim() && data.lastName.trim() && data.password.trim() && acceptTerms;

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
\n... [component continues] ...
```

**TestChat.jsx**

```jsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const TestChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Hey! How are you?", time: "10:30 AM", type: "text" },
    { id: 2, sender: "Bob", text: "I'm good! Thanks for asking.", time: "10:31 AM", type: "text" },
    { id: 3, sender: "Alice", text: "Great! Check out this image", time: "10:32 AM", type: "image", url: "https://via.placeholder.com/300x200" },
    { id: 4, sender: "Bob", text: "Nice! 👍", time: "10:33 AM", type: "text" },
    { id: 5, sender: "Alice", text: "Voice message test", time: "10:34 AM", type: "voice", duration: "00:15" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedTest, setSelectedTest] = useState("basic");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const addTestMessage = (type) => {
    let message;
    switch (type) {
      case "image":
        message = {
          id: messages.length + 1,
          sender: "Test Bot",
          text: "Image message",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "image",
          url: "https://via.placeholder.com/300x200/4f46e5/ffffff?text=Test+Image"
        };
        break;
      case "voice":
        message = {
          id: messages.length + 1,
          sender: "Test Bot",
          text: "Voice message",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "voice",
          duration: "00:23"
        };
        break;
      case "file":
        message = {
          id: messages.length + 1,
          sender: "Test Bot",
          text: "document.pdf",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: "file",
          size: "2.5 MB"
        };
        break;
      case "typing":
        // Simulate typing indicator
        setTimeout(() => {
          const message = {
            id: messages.length + 1,
            sender: "Test Bot",
            text: "This message was sent after typing indicator",
\n... [component continues] ...
```

**VerifyEmail.jsx**

```jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const { id, token } = useParams();
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, checkAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        if (isAuthenticated) navigate("/");
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/user/${id}/verify/${token}`);
                toast.success(response.data.message);
                // console.log("Verification successful:", response.data);
            } catch (error) {
                setLoading(false);
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token]);

    return (
        <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
            {loading && (
                <div className="mb-10 flex flex-col items-center" role="status">
                    <svg
                        aria-hidden="true"
                        className="w-20 h-20 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.5908C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span className="my-4 text-lg">Loading...</span>
                </div>
            )}
            {!loading && (
                <span className="my-4 text-xl font-medium">Verification Successful</span>
            )}
            {!loading && !isAuthenticated && (
                <Link
                    to={"/login"}
                    className="inline-flex items-center justify-center px-5 py-3 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm"
                >
                    Login
                    <svg
                        className="w-5 h-5 ml-2 -mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </Link>
\n... [component continues] ...
```


#### UI Components

**Avatar.jsx**

```jsx
export default function Avatar({ username, userId, avatarLink }) {
  const colors = [
    "#90CDF4",
    "#F56565",
    "#D6BCFA",
    "#BC85E0",
    "#7F9CF5",
    "#F6AD55",
    "#F687B3",
    "#68D391",
    "#FBBF24",
    "#4299E1",
  ];
  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  const squircleStyles = {
    "--squircle-bg-color": color,
  };
  return (
    <div className={`squircle relative text-black`} style={squircleStyles}>
      <div
        className="squircle__inline text-xl text-white uppercase"
        style={{ textShadow: "0.4px 0.4px 1px gray" }}
      >
        {username && avatarLink ? (
          <img
            src={avatarLink}
            className="h-10 w-10 grid place-content-center rounded-full"
            alt={username[0]}
          />
        ) : (
          <span>{username[0]}</span>
        )}
      </div>
      <style>
        {`
        .squircle {
          --squircle-fg: var(--bg, #ffffff);
          --squircle-size: 44px;
          --squircle-radii: 50% / 10%;
          aspect-ratio: 1;
          display: grid;
          grid-template-columns: 1fr;
          max-width: 80%;
          width: var(--squircle-size);
        }
        .squircle::before,
        .squircle::after {
          align-self: center;
          background-color: var(--squircle-bg-color, #6B8AFD);
          content: "";
          grid-column: 1;
          grid-row: 1;
          justify-self: center;
        }
        .squircle::before,
        .squircle::after {
          border-radius: var(--squircle-radii);
          height: 115%;
\n... [component continues] ...
```

**ChatArea.jsx**

```jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Reply,
  Edit3,
  Trash2,
  Download,
  File,
  Image,
  Mic,
  Phone,
  Video,
  Hash,
  Users,
  Settings,
  Search
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { connectSocket } from "../../sockets/socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatArea() {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const selectedUser = "Alice"; // Placeholder

  const channels = [
    { id: "general", name: "General", type: "channel", memberCount: 12 },
    { id: "random", name: "Random", type: "channel", memberCount: 8 },
    { id: "development", name: "Development", type: "channel", memberCount: 5 },
    { id: "alice", name: "Alice", type: "dm", status: "online" },
    { id: "bob", name: "Bob", type: "dm", status: "offline" }
  ];

  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      if (token) {
        const socket = connectSocket(token);
        if (socket) {
          socket.on("receiveMessage", (data) => {
            setMessages((prev) => [...prev, {
              ...data,
              status: 'delivered',
              reactions: [],
              threadCount: 0
            }]);
\n... [component continues] ...
```

**ChatMessages.jsx**

```jsx
import React, { useEffect, useRef } from "react";

const ChatMessages = ({ messages, userDetails, selectedUserId }) => {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, messagesContainerRef]);

  return (
    <div
      className="absolute bottom-24 w-full px-7 lg:px-20 left-0"
      ref={messagesContainerRef}
    >
      {selectedUserId && (
        <div className="flex flex-col gap-2">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`text-white ${
                message.sender !== userDetails._id
                  ? "bg-blue-600 self-start rounded-r-2xl"
                  : "bg-blue-700 self-end rounded-l-2xl"
              } relative group rounded-b-2xl px-5 py-3`}
            >
              <div
                style={{ wordWrap: "break-word" }}
                className="flex flex-wrap max-w-[500px] overflow-hidden"
              >
                {message.text}
              </div>
              <div
                className={`absolute top-0 w-0 h-0 ${
                  message.sender !== userDetails._id
                    ? "border-r-blue-600 -left-4 border-r-[20px]"
                    : "-right-4 border-l-blue-700 border-l-[20px]"
                } border-b-[20px] border-b-transparent`}
              ></div>
            </div>
          ))}
        </div>
      )}
      {selectedUserId && !messages.length && (
        <div className="text-gray-500 flex items-end justify-center">
          Start a conversation
        </div>
      )}
    </div>
  );
};

export default ChatMessages;\n... [component continues] ...
```

**ChatWindow.jsx**

```jsx
import { useState, useRef, useEffect, memo, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Avatar from "../ui/Avatar"
import { useChatStore } from "../../store/chatStore"
import { useAuthStore } from "../../store/authStore"
import Message from "./Message"

const ChatWindow = memo(() => {

    const messages = useChatStore((s) => s.messages) || []
    const selectedUser = useChatStore((s) => s.selectedUser)
    const onlineUsers = useChatStore((s) => s.onlineUsers) || []
    const sendMessage = useChatStore((s) => s.sendMessage)

    const user = useAuthStore((s) => s.user)

    const [text, setText] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    const bottomRef = useRef(null)
    const inputRef = useRef(null)

    /* Auto scroll */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    /* Send message */
    const handleSend = useCallback(() => {

        const message = text.trim()

        if (!message || !selectedUser || !user?._id) return

        sendMessage({
            receiverId: selectedUser,
            text: message,
            senderId: user._id
        })

        setText("")
        setIsTyping(false)

    }, [text, selectedUser, sendMessage, user])

    /* Enter key send */
    const handleKeyDown = useCallback((e) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }

    }, [handleSend])

    /* Typing indicator */
    const handleInputChange = useCallback((e) => {
        setText(e.target.value)
        if (selectedUser && e.target.value.trim()) {
            setIsTyping(true)
\n... [component continues] ...
```

**Contact.jsx**

```jsx
import React from "react";
import Avatar from "./Avatar";

const Contact = ({
  userId,
  username,
  selectedUserId,
  setSelectedUserId,
  isOnline,
  avatarLink,
}) => {
  return (
    <li
      key={userId}
      className={`${
        selectedUserId === userId ? "bg-blue-600" : ""
      } capitalize py-2 lg:py-3 px-2 lg:px-5 rounded-[1.3rem] cursor-pointer`}
      onClick={() => {
        setSelectedUserId(userId);
      }}
    >
      <Avatar
        userId={userId}
        username={username}
        isOnline={isOnline}
        avatarLink={avatarLink}
      />
      <span className="text-xs lg:text-base text-center">{username}</span>
      {isOnline && (
        <span className="text-xs rounded-full bg-green-500 px-2 py-1">
          Active
        </span>
      )}
    </li>
  );
};

export default Contact;\n... [component continues] ...
```

**Message.jsx**

```jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from 'timeago.js';
import {
  Reply,
  MoreHorizontal,
  Edit3,
  Trash2,
  Heart,
  ThumbsUp,
  Smile,
  MessageCircle,
  Download,
  File,
  Image as ImageIcon,
  Mic,
  Play,
  Pause
} from "lucide-react";

export default function Message({
  id,
  text,
  sender,
  timestamp,
  attachments = [],
  reactions = [],
  threadCount = 0,
  edited = false,
  readBy = [],
  onReaction,
  onReply,
  showAvatar = true,
  showTimestamp = true,
  isConsecutive = false,
  isMine = false
}) {
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const commonReactions = ["❤️", "👍", "👎", "😂", "😮", "😢", "😡"];

  const handleReaction = (emoji) => {
    onReaction && onReaction(id, emoji);
    setShowReactionPicker(false);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderAttachment = (attachment, index) => {
    const { type, url, name, size } = attachment;

    if (type.startsWith('image/')) {
      return (
        <motion.div
\n... [component continues] ...
```

**MessageInput.jsx**

```jsx
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Image,
  File,
  X,
  Upload,
  Loader
} from "lucide-react";
import { sendMessage, startTyping, stopTyping } from "../../websocket/socket";
import toast from "react-hot-toast";

export default function MessageInput({ onSendMessage, placeholder = "Type a message..." }) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef();
  const fileRef = useRef();
  const typingTimeoutRef = useRef();

  const handleSend = useCallback(() => {
    if (!text.trim() && attachments.length === 0) return;

    const messageData = {
      text: text.trim(),
      attachments: attachments,
      timestamp: new Date().toISOString()
    };

    onSendMessage(messageData);

    // Clear input
    setText("");
    setAttachments([]);
    setIsTyping(false);
    stopTyping && stopTyping();
  }, [text, attachments, onSendMessage]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Handle typing indicators
    if (value && !isTyping) {
      setIsTyping(true);
\n... [component continues] ...
```

**MessageInputForm.jsx**

```jsx
import React from "react";

const MessageInputForm = ({
  selectedUserId,
  newMessage,
  setNewMessage,
  sendMessage,
}) => {
  return (
    <>
      {selectedUserId && (
        <form onSubmit={sendMessage} className="relative m-4 w-full">
          <input
            type="text"
            id="message-input"
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white placeholder-gray-400"
            placeholder="Your Message"
            value={newMessage}
            onChange={(ev) => setNewMessage(ev.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute end-0 top-0 aspect-square h-full font-medium text-white hover:text-blue-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12.73a59.769 59.769 0 0 1-18.216 9.605L6 12Z"
              />
            </svg>
          </button>
        </form>
      )}
    </>
  );
};

export default MessageInputForm;\n... [component continues] ...
```

**MessageList.jsx**

```jsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Message from "./Message";

export default function MessageList({
  messages,
  isTyping,
  selectedUser,
  onReaction,
  onReply
}) {
  const bottomRef = useRef();
  const [visibleMessages, setVisibleMessages] = useState([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAt || message.timestamp).toDateString();

      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = {
          date: messageDate,
          messages: []
        };
        groups.push(currentGroup);
      }

      currentGroup.messages.push({
        ...message,
        showAvatar: index === 0 || messages[index - 1].sender !== message.sender,
        showTimestamp: index === 0 || messages[index - 1].sender !== message.sender,
        isConsecutive: index > 0 && messages[index - 1].sender === message.sender
      });
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        weekday: 'long',
\n... [component continues] ...
```

**Nav.jsx**

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { logout, user } = useAuth();
  const [isMobile, setIsMobile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      <button
        onClick={() => setIsMobile(!isMobile)}
        className="flex fixed bottom-5 right-5 h-10 aspect-square lg:hidden bg-blue-600 text-white rounded-full z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 m-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      {isMobile && (
        <header className="fixed h-screen w-[150px] z-40 lg:static bg-zinc-800">
          <Link
            to="/"
            className="flex gap-2 items-center justify-center border-b border-gray-600 py-4"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Swift Logo"
            />
            <span className="font-semibold text-xl text-white">Swift</span>
          </Link>
          <nav className="h-full flex flex-col my-4 justify-between">
            <div className="flex flex-col gap-5">
              <Link to="/profile" className="flex items-center gap-2 text-white hover:text-blue-400 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
\n... [component continues] ...
```

**OnlineUserList.jsx**

```jsx
import React, { useState } from "react";
import Avatar from "./Avatar";
import Contact from "./Contact";

const OnlineUsersList = ({
  onlinePeople,
  offlinePeople,
  selectedUserId,
  setSelectedUserId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOnlinePeople = Object.keys(onlinePeople).filter((userId) => {
    const username = onlinePeople[userId].username || "";
    return username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredOfflinePeople = Object.keys(offlinePeople).filter((userId) => {
    const { firstName, lastName } = offlinePeople[userId];
    const fullName = `${firstName} ${lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <section className="w-[29%] py-3 border-r border-gray-600 px-2 lg:px-4 bg-zinc-900">
      <div className="text-white flex items-center gap-2 p-1 px-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 hidden sm:block"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent outline-none text-white placeholder-gray-400"
        />
      </div>
      <div className="max-h-[85vh] overflow-auto no-scrollbar">
        {filteredOnlinePeople.map((userId) => {
          const { username, avatarLink } = onlinePeople[userId];
          return (
            <Contact
              key={userId}
              userId={userId}
              username={username}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              isOnline={true}
              avatarLink={avatarLink}
\n... [component continues] ...
```

**TopBar.jsx**

```jsx
import React from "react";

const TopBar = ({
  setSelectedUserId,
  selectedUserId,
  offlinePeople,
  onlinePeople,
}) => {
  return (
    <div className="absolute right-2 text-white w-full py-5 bg-zinc-800 rounded-lg px-4 flex items-center justify-between">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 cursor-pointer"
        role="button"
        onClick={() => setSelectedUserId(null)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
      {onlinePeople[selectedUserId] ? (
        <>
          <span>{onlinePeople[selectedUserId].username}</span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
        </>
      ) : (
        <>
          <span>{offlinePeople[selectedUserId]?.firstName}</span>
          <span className="h-3 w-3 rounded-full bg-gray-500"></span>
        </>
      )}
    </div>
  );
};

export default TopBar;\n... [component continues] ...
```

**UserList.jsx**

```jsx
import { useEffect, useState, useMemo } from "react"
import { useChatStore } from "../../store/chatStore"
import { useAuthStore } from "../../store/authStore"
import Avatar from "../ui/Avatar"
import { getPeople } from "../../api/peopleApi"

export default function UserList() {

  const onlineUsers = useChatStore((s) => s.onlineUsers) || []
  const setSelectedUser = useChatStore((s) => s.setSelectedUser)
  const selectedUser = useChatStore((s) => s.selectedUser)

  const currentUser = useAuthStore((s) => s.user)

  const [allUsers, setAllUsers] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadUsers = async () => {
      try {
        const users = await getPeople()

        // remove current user from list
        const filtered = users.filter(u => u._id !== currentUser?._id)

        setAllUsers(filtered)

      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()

  }, [currentUser])

  const searchTerm = search.toLowerCase()

  const filteredUsers = useMemo(() => {

    return allUsers.filter((user) => {

      const name =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase()

      return name.includes(searchTerm)

    })

  }, [allUsers, searchTerm])

  const noResults = !loading && filteredUsers.length === 0

  return (

    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm">
\n... [component continues] ...
```

**VirtualizedMessageList.jsx**

```jsx
import { memo, useEffect, useRef } from "react"
import Message from "./Message"

const VirtualizedMessageList = memo(({ messages = [], onReaction, user }) => {

    const bottomRef = useRef(null)

    /* Auto scroll to latest message */

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length])

    if (!messages.length) {
        return (
            <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
                No messages yet
            </div>
        )
    }

    return (

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">

            {messages.map((message, index) => {

                const senderId =
                    message?.senderId || message?.sender?._id

                const isOwn = senderId === user?._id

                return (
                    <Message
                        key={message._id || index}
                        message={message}
                        isOwn={isOwn}
                        onReaction={onReaction}
                        user={user}
                    />
                )
            })}

            <div ref={bottomRef} />

        </div>
    )

})

VirtualizedMessageList.displayName = "VirtualizedMessageList"

export default VirtualizedMessageList\n... [component continues] ...
```


### API Layer

#### api.js

```javascript
import { API_BASE_URL } from "../constants";

const API_URL = `${API_BASE_URL}/api`;

export const registerUser = async(data) => {

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return res.json();

};

export const loginUser = async(data) => {

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    return res.json();

};
export const getUnreadCounts = async() => {

    const res = await fetch(`${API_URL}/messages/unread/counts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    return res.json();

};
export const uploadImage = async(file) => {

    try {

        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch(`${API_URL}/upload/image`, {
            method: "POST",
            body: formData
        })

        if (!res.ok) {
            throw new Error("Upload failed")
        }

        return await res.json()

    } catch (err) {
        console.error("Upload error:", err)
    }

};```

#### authApi.js

```javascript
import api from "./axios";

/* --------- Generic request handler --------- */

const handleRequest = async(request) => {
    try {
        const res = await request();
        return res.data;
    } catch (error) {
        const message =
            (error && error.response && error.response.data && error.response.data.message) ||
            (error && error.message) ||
            "API request failed";

        console.error("API Error:", message);
        throw message;
    }
};

/* ---------------- LOGIN ---------------- */

export const loginUser = (data) =>
    handleRequest(() => api.post("/api/user/login", data));

/* ---------------- REGISTER ---------------- */

export const registerUser = (data) =>
    handleRequest(() => api.post("/api/user/register", data));

/* ---------------- PROFILE ---------------- */

export const getProfile = () =>
    handleRequest(() => api.get("/api/user/profile"));```

#### axios.js

```javascript
import axios from "axios"
import { baseUrl } from "../apiConfig"

const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true
})

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config

})

export default api```

#### groupApi.js

```javascript
import api from "./axios";

/* ---------------- GET GROUPS ---------------- */

export const getGroups = async() => {
    try {

        const res = await api.get("/api/group");
        return res.data;

    } catch (error) {

        let message = "Failed to fetch groups";

        if (error && error.response && error.response.data) {

            const data = error.response.data;

            if (typeof data === "object" && data.message) {
                message = data.message;
            } else if (typeof data === "string") {
                message = data;
            }

        } else if (error && error.message) {

            message = error.message;
        }

        console.error("Failed to fetch groups:", message);

        throw new Error(message);
    }
};


/* ---------------- CREATE GROUP ---------------- */

export const createGroup = async(data) => {
    try {

        const res = await api.post("/api/group", data);
        return res.data;

    } catch (error) {

        let message = "Failed to create group";

        if (error && error.response && error.response.data) {

            const data = error.response.data;

            if (typeof data === "object" && data.message) {
                message = data.message;
            } else if (typeof data === "string") {
                message = data;
            }

        } else if (error && error.message) {

            message = error.message;
        }

        console.error("Failed to create group:", message);

        throw new Error(message);
    }
};```

#### messageApi.js

```javascript
import api from "./axios";

/* ---------------- GET MESSAGES ---------------- */

export const getMessages = async(userId) => {

    if (!userId) {
        throw new Error("User ID is required to fetch messages");
    }

    try {

        const res = await api.get(`/api/user/messages/${userId}`);

        return res.data;

    } catch (error) {

        let message = "Failed to fetch messages";

        if (error && error.response && error.response.data) {

            const data = error.response.data;

            if (typeof data === "object" && data.message) {
                message = data.message;
            } else if (typeof data === "string") {
                message = data;
            }

        } else if (error && error.message) {

            message = error.message;
        }

        console.error("Failed to fetch messages:", message);

        throw new Error(message);
    }
};```

#### peopleApi.js

```javascript
import api from "./axios";

/* ---------------- GET PEOPLE ---------------- */

export const getPeople = async() => {
    try {
        const res = await api.get("/api/user/people");
        return res.data;
    } catch (error) {
        let message = "Failed to fetch people";
        if (error && error.response && error.response.data) {
            const data = error.response.data;
            if (typeof data === "object" && data.message) {
                message = data.message;
            } else if (typeof data === "string") {
                message = data;
            }
        } else if (error && error.message) {
            message = error.message;
        }
        console.error("Failed to fetch people:", message);
        throw new Error(message);
    }
};```

#### reactionApi.js

```javascript
import api from "./axios";

/* ---------------- ADD REACTION ---------------- */

export const addReaction = async(messageId, emoji) => {

    if (!messageId || !emoji) {
        throw new Error("Message ID and emoji are required");
    }

    try {

        const res = await api.post("/api/user/reaction", {
            messageId,
            emoji
        });

        return res.data;

    } catch (error) {

        let message = "Failed to add reaction";

        if (error && error.response && error.response.data) {

            const data = error.response.data;

            if (typeof data === "object" && data.message) {
                message = data.message;
            } else if (typeof data === "string") {
                message = data;
            }

        } else if (error && error.message) {

            message = error.message;
        }

        console.error("Failed to add reaction:", message);

        throw new Error(message);
    }
};```


## Environment Configuration

### .env File (Development Template)\n
```bash
```

## Setup & Deployment

### Prerequisites\n

- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB instance or MongoDB Atlas account
- Redis server
- SMTP credentials (optional, for email features)

### Installation

\`\`\`bash
# Install dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
\`\`\`

### Development Setup

\`\`\`bash
npm run dev
\`\`\`

### Building for Production

\`\`\`bash
# Build frontend
cd frontend && npm run build

# Build server (if applicable)
cd server && npm run build
\`\`\`

### Environment Variables Required

- `NODE_ENV`: Development or production
- `PORT`: Server port (default: 4000)
- `DB`: MongoDB connection string
- `JWTPRIVATEKEY`: JWT secret key
- `REDIS_URL`: Redis connection URL
- `BASE_URL`: Frontend base URL
- SMTP credentials for email service

### Deployment Options

1. **Netlify** (Frontend only)
2. **Railway** (Full-stack)
3. **Heroku** (Legacy, using Procfile)
4. **Custom VPS** (Docker supported)

