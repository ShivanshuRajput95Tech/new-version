const express = require("express");
const { updateProfile, updateStatus } = require("../controllers/profileController");
const protect = require("../middleware/protect");

const router = express.Router();

router.put("/update", protect, updateProfile);
router.put("/status", protect, updateStatus);

module.exports = router;