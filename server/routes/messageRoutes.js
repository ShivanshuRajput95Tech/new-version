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

module.exports = router;