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
  getUnreadCounts,
} = require("../controllers/messageController");

router.post("/", authMiddleware, sendMessage);
router.post("/reaction", authMiddleware, addReaction);
router.get("/thread/:threadId", authMiddleware, getThreadMessages);
router.get("/unread/counts", authMiddleware, getUnreadCounts);
router.put("/:messageId", authMiddleware, editMessage);
router.delete("/:messageId", authMiddleware, deleteMessage);
router.get("/:userId", authMiddleware, getMessages);

module.exports = router;
