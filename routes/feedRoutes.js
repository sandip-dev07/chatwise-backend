const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, feedController.getUserFeed);

module.exports = router;
