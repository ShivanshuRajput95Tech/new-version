const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getPeople } = require("../controllers/peopleController");

const router = express.Router();

router.get("/", authMiddleware, getPeople);

module.exports = router;
