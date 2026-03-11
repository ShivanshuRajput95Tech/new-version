const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { register, login, verifyEmail, me, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, me);
router.get("/:id/verify/:token", verifyEmail);

module.exports = router;
