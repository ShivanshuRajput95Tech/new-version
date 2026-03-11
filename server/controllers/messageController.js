const Message = require("../models/Message");
const User = require("../models/User");
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

        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.sendMessage = async(req, res) => {
    const { recipientId, text, channel = "general", messageType = "text", attachments = [], threadId = null } = req.body;
    const senderId = req.user._id;

    try {
        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            text,
            channel,
            messageType,
            attachments,
            threadId,
            readBy: [{ user: senderId, readAt: new Date() }]
        });

        await message.save();

        // If this is a reply to a thread, increment reply count
        if (threadId) {
            await Message.findByIdAndUpdate(threadId, { $inc: { replyCount: 1 } });
        }

        // Clear cache
        const cacheKey1 = `messages:${senderId}:${recipientId}:${channel}:*:*`;
        const cacheKey2 = `messages:${recipientId}:${senderId}:${channel}:*:*`;
        await redisClient.del(cacheKey1);
        await redisClient.del(cacheKey2);

        // Populate sender info
        await message.populate("sender", "username avatar");

        res.status(201).json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.addReaction = async(req, res) => {
    const { messageId, emoji } = req.body;
    const userId = req.user._id;

    try {
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Check if user already reacted with this emoji
        const existingReaction = message.reactions.find(r => r.emoji === emoji);

        if (existingReaction) {
            // Check if user already reacted
            const userIndex = existingReaction.users.indexOf(userId);
            if (userIndex > -1) {
                // Remove reaction
                existingReaction.users.splice(userIndex, 1);
                existingReaction.count--;

                if (existingReaction.count === 0) {
                    message.reactions = message.reactions.filter(r => r.emoji !== emoji);
                }
            } else {
                // Add reaction
                existingReaction.users.push(userId);
                existingReaction.count++;
            }
        } else {
            // Add new reaction
            message.reactions.push({
                emoji,
                users: [userId],
                count: 1
            });
        }

        await message.save();

        // Clear cache
        const cacheKey1 = `messages:${message.sender}:${message.recipient}:${message.channel}:*:*`;
        const cacheKey2 = `messages:${message.recipient}:${message.sender}:${message.channel}:*:*`;
        await redisClient.del(cacheKey1);
        await redisClient.del(cacheKey2);

        res.json(message);
    } catch (error) {
        console.error("Error adding reaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getThreadMessages = async(req, res) => {
    const { threadId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    try {
        const messages = await Message.find({ threadId })
            .populate("sender", "username avatar")
            .sort({ createdAt: 1 })
            .limit(parseInt(limit))
            .skip(parseInt(offset));

        res.json(messages);
    } catch (error) {
        console.error("Error fetching thread messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.editMessage = async(req, res) => {
    const { messageId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    try {
        const message = await Message.findOneAndUpdate(
            { _id: messageId, sender: userId },
            {
                text,
                edited: true,
                editedAt: new Date()
            },
            { new: true }
        ).populate("sender", "username avatar");

        if (!message) {
            return res.status(404).json({ error: "Message not found or not authorized" });
        }

        // Clear cache
        const cacheKey1 = `messages:${message.sender}:${message.recipient}:${message.channel}:*:*`;
        const cacheKey2 = `messages:${message.recipient}:${message.sender}:${message.channel}:*:*`;
        await redisClient.del(cacheKey1);
        await redisClient.del(cacheKey2);

        res.json(message);
    } catch (error) {
        console.error("Error editing message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteMessage = async(req, res) => {
    const { messageId } = req.params;
    const userId = req.user._id;

    try {
        const message = await Message.findOneAndDelete({
            _id: messageId,
            sender: userId
        });

        if (!message) {
            return res.status(404).json({ error: "Message not found or not authorized" });
        }

        // If this was a reply, decrement reply count
        if (message.threadId) {
            await Message.findByIdAndUpdate(message.threadId, { $inc: { replyCount: -1 } });
        }

        // Clear cache
        const cacheKey1 = `messages:${message.sender}:${message.recipient}:${message.channel}:*:*`;
        const cacheKey2 = `messages:${message.recipient}:${message.sender}:${message.channel}:*:*`;
        await redisClient.del(cacheKey1);
        await redisClient.del(cacheKey2);

        res.json({ success: true, message: "Message deleted" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getUnreadCounts = async(req, res) => {
    const ourUserId = req.user._id;

    try {
        const unreadCounts = await Message.aggregate([
            { $match: { recipient: ourUserId, read: false } },
            { $group: { _id: { sender: "$sender", channel: "$channel" }, count: { $sum: 1 } } }
        ]);

        const formattedCounts = {};
        unreadCounts.forEach(item => {
            const key = `${item._id.sender}_${item._id.channel}`;
            formattedCounts[key] = item.count;
        });

        res.json(formattedCounts);
    } catch (error) {
        console.error("Error fetching unread counts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
