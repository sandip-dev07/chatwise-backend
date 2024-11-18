const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  validatePost,
  validate,
} = require("../middlewares/validationMiddleware");

router.post(
  "/",
  authMiddleware,
  validatePost,
  validate,
  postController.createPost
);

router.post("/:postId/like", authMiddleware, postController.likePost);

router.post(
  "/:postId/comment",
  authMiddleware,
  validatePost,
  validate,
  postController.addComment
);

router.get("/:postId/likes", authMiddleware, postController.getLikes);

module.exports = router;
