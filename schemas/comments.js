const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    password: { type: String, required: true, unique: true},
    content: { type: String, required: true },
    createdAt: Date // createdAt 필드 추가
  },
);

module.exports = mongoose.model("Comments", commentsSchema);
