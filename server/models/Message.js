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

module.exports = mongoose.model("Message", messageSchema);