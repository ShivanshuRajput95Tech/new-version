const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const winston = require("winston");

const app = express();
const PORT = process.env.PORT || 4000; // Use same port as production for consistency

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'logs/local-server.log' })
    ]
});

// Ensure logs directory exists
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads with size limits
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join(uploadsDir, req.body.userId || 'anonymous');
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'video/mp4', 'video/avi', 'video/mov'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
        files: 10 // Max 10 files at once
    }
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178"],
    credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Simple in-memory storage for demo
let messages = [];
let onlineUsers = new Map();
let users = new Map(); // Store user info
let reactions = new Map(); // Store reactions by messageId
let threads = new Map(); // Store thread messages

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No file uploaded"
            });
        }

        const fileUrl = `/uploads/${req.body.userId || 'anonymous'}/${req.file.filename}`;
        const fileData = {
            id: Date.now().toString(),
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            url: fileUrl,
            uploadedAt: new Date().toISOString(),
            uploadedBy: req.body.userId || 'anonymous'
        };

        logger.info('File uploaded successfully', { fileData });

        res.json({
            success: true,
            file: fileData
        });
    } catch (error) {
        logger.error('File upload error', { error: error.message });
        res.status(500).json({
            success: false,
            error: "Upload failed"
        });
    }
});

// Get messages endpoint
app.get("/api/messages", (req, res) => {
    try {
        const { channel, limit = 50, offset = 0 } = req.query;

        let filteredMessages = messages;
        if (channel) {
            filteredMessages = messages.filter(msg => msg.channel === channel);
        }

        // Sort by timestamp descending and apply pagination
        const paginatedMessages = filteredMessages
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

        res.json({
            success: true,
            messages: paginatedMessages.reverse(), // Return in chronological order
            total: filteredMessages.length
        });
    } catch (error) {
        logger.error('Error fetching messages', { error: error.message });
        res.status(500).json({
            success: false,
            error: "Failed to fetch messages"
        });
    }
});

// Get users endpoint
app.get("/api/users", (req, res) => {
    try {
        const userList = Array.from(users.values()).map(user => ({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            status: onlineUsers.has(user.id) ? 'online' : 'offline',
            lastSeen: user.lastSeen
        }));

        res.json({
            success: true,
            users: userList
        });
    } catch (error) {
        logger.error('Error fetching users', { error: error.message });
        res.status(500).json({
            success: false,
            error: "Failed to fetch users"
        });
    }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: "1.0.0-local"
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error('Unhandled error', { error: error.message, stack: error.stack });
    res.status(500).json({
        success: false,
        error: "Internal server error"
    });
});

const server = app.listen(PORT, () => {
    logger.info(`🚀 Local Chat Server running on port ${PORT}`);
    logger.info(`📁 File uploads: http://localhost:${PORT}/uploads`);
    logger.info(`💬 Messages API: http://localhost:${PORT}/api/messages`);
    logger.info(`❤️  Health check: http://localhost:${PORT}/api/health`);
});

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178"],
        credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

// JWT-like authentication middleware for local development
io.use((socket, next) => {
    // In local development, we'll accept any connection
    // In production, you'd verify JWT tokens here
    const token = socket.handshake.auth.token;
    if (!token && process.env.NODE_ENV === 'production') {
        return next(new Error('Authentication error'));
    }

    // For local development, create a mock user
    socket.userId = socket.handshake.auth.userId || `user_${Date.now()}`;
    socket.username = socket.handshake.auth.username || `User ${socket.userId.slice(-4)}`;

    next();
});

io.on("connection", (socket) => {
    logger.info(`👤 User connected: ${socket.id} (${socket.username})`);

    // Register user
    users.set(socket.userId, {
        id: socket.userId,
        name: socket.username,
        avatar: null,
        lastSeen: new Date().toISOString()
    });

    // Add to online users
    onlineUsers.set(socket.userId, {
        id: socket.userId,
        name: socket.username,
        socketId: socket.id,
        connectedAt: new Date().toISOString()
    });

    // Broadcast online users update
    io.emit("onlineUsers", Array.from(onlineUsers.values()));

    // Handle user joining a channel/room
    socket.on("join", (data) => {
        const { channel = "general", userData } = data;

        if (userData) {
            users.set(socket.userId, { ...users.get(socket.userId), ...userData });
        }

        socket.join(channel);
        logger.info(`📊 User ${socket.username} joined channel: ${channel}`);
        logger.info(`📊 Online users: ${onlineUsers.size}`);
    });

    // Handle sending messages
    socket.on("sendMessage", (messageData) => {
        try {
            const message = {
                id: Date.now().toString(),
                ...messageData,
                senderId: socket.userId,
                senderName: socket.username,
                timestamp: new Date().toISOString(),
                status: 'delivered',
                reactions: [],
                threadCount: 0,
                channel: messageData.channel || 'general'
            };

            messages.push(message);

            // Broadcast to channel/room
            io.to(message.channel).emit("message", message);

            logger.info(`💬 Message sent by ${socket.username}: ${message.text?.substring(0, 50) || 'File/Attachment'}...`);
        } catch (error) {
            logger.error('Error sending message', { error: error.message });
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    // Handle reactions
    socket.on("addReaction", (reactionData) => {
        try {
            const { messageId, emoji, userId = socket.userId } = reactionData;

            if (!reactions.has(messageId)) {
                reactions.set(messageId, new Map());
            }

            const messageReactions = reactions.get(messageId);
            if (!messageReactions.has(emoji)) {
                messageReactions.set(emoji, new Set());
            }

            messageReactions.get(emoji).add(userId);

            // Broadcast reaction update
            io.emit("reaction", {
                messageId,
                emoji,
                userId,
                action: 'add'
            });

            logger.info(`😀 Reaction added: ${emoji} to message ${messageId} by ${socket.username}`);
        } catch (error) {
            logger.error('Error adding reaction', { error: error.message });
        }
    });

    socket.on("removeReaction", (reactionData) => {
        try {
            const { messageId, emoji, userId = socket.userId } = reactionData;

            const messageReactions = reactions.get(messageId);
            if (messageReactions?.has(emoji)) {
                messageReactions.get(emoji).delete(userId);

                // Clean up empty reaction sets
                if (messageReactions.get(emoji).size === 0) {
                    messageReactions.delete(emoji);
                }

                // Broadcast reaction update
                io.emit("reaction", {
                    messageId,
                    emoji,
                    userId,
                    action: 'remove'
                });

                logger.info(`😔 Reaction removed: ${emoji} from message ${messageId} by ${socket.username}`);
            }
        } catch (error) {
            logger.error('Error removing reaction', { error: error.message });
        }
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
        socket.to(data.channel || 'general').emit("typing", {
            userId: socket.userId,
            username: socket.username,
            channel: data.channel
        });
    });

    socket.on("stopTyping", (data) => {
        socket.to(data.channel || 'general').emit("stopTyping", {
            userId: socket.userId,
            username: socket.username,
            channel: data.channel
        });
    });

    // Handle thread replies
    socket.on("sendThreadMessage", (threadData) => {
        try {
            const { parentMessageId, ...messageData } = threadData;

            const threadMessage = {
                id: Date.now().toString(),
                ...messageData,
                senderId: socket.userId,
                senderName: socket.username,
                timestamp: new Date().toISOString(),
                status: 'delivered',
                parentMessageId,
                isThread: true
            };

            // Store thread message
            if (!threads.has(parentMessageId)) {
                threads.set(parentMessageId, []);
            }
            threads.get(parentMessageId).push(threadMessage);

            // Update parent message thread count
            const parentMessage = messages.find(m => m.id === parentMessageId);
            if (parentMessage) {
                parentMessage.threadCount = (parentMessage.threadCount || 0) + 1;
            }

            // Broadcast thread message
            io.emit("threadMessage", threadMessage);

            logger.info(`🧵 Thread reply sent by ${socket.username} to message ${parentMessageId}`);
        } catch (error) {
            logger.error('Error sending thread message', { error: error.message });
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        // Update user's last seen time
        if (users.has(socket.userId)) {
            users.get(socket.userId).lastSeen = new Date().toISOString();
        }

        // Remove from online users
        onlineUsers.delete(socket.userId);

        // Broadcast online users update
        io.emit("onlineUsers", Array.from(onlineUsers.values()));

        logger.info(`👋 User disconnected: ${socket.id} (${socket.username})`);
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('\n🛑 Shutting down local chat server...');

    // Close all connections
    io.close(() => {
        logger.info('✅ Socket.IO server closed');
    });

    server.close(() => {
        logger.info('✅ HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    logger.info('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});