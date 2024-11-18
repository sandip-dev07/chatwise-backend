const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  validateRegistration,
  validate,
} = require("../middlewares/validationMiddleware");

router.post(
  "/register",
  validateRegistration,
  validate,
  userController.registerUser
);
router.post("/login", userController.login);
router.post(
  "/friend-request",
  authMiddleware,
  userController.sendFriendRequest
);
router.put(
  "/friend-request/:requestId/accept",
  authMiddleware,
  userController.acceptFriendRequest
);

module.exports = router;
