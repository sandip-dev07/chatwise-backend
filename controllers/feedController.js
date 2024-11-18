const Post = require("../models/Post");
const User = require("../models/User");

exports.getUserFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user's friends
    const user = await User.findById(userId).populate("friends.user");

    const friendIds = user.friends
      .filter((friend) => friend.status === "accepted")
      .map((friend) => friend.user._id);

    // Add user's own ID to include their posts
    friendIds.push(userId);

    // Fetch feed posts
    const feed = await Post.find({
      $or: [
        { user: { $in: friendIds } },
        {
          "comments.user": { $in: friendIds },
          user: { $ne: userId },
        },
      ],
    })
      .populate("user", "username profile")
      .populate("comments.user", "username profile")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ feed });
  } catch (error) {
    res.status(500).json({ error: "Error fetching feed" });
  }
};
