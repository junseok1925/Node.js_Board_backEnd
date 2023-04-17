const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
        unique: true,
      },
      user: {
        type: String,
        required: true,
      },
      password: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model("Posts", postsSchema);
