const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
  {

    user: { type: String, required: true },
    password: { type: String, required: true, unique: true},
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: Date // createdAt 필드 추가
  },
);

module.exports = mongoose.model("Posts", postsSchema);
