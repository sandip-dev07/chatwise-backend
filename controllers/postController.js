const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    const post = new Post({
      user: userId,
      content,
    });

    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if already liked
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likeCount: post.likes.length,
      isLiked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ error: "Error processing like/unlike" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({
      user: userId,
      content,
    });

    await post.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment: post.comments[post.comments.length - 1],
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding comment" });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "likes",
      "username profile"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      likeCount: post.likes.length,
      likedBy: post.likes.map((user) => ({
        id: user._id,
        username: user.username,
        profilePicture: user.profile?.profilePicture,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching likes" });
  }
};
