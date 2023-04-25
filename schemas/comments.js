const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  nickname: { type: String, required: true },
  userId: {type: String,require: true,},
  postId: { type: String, required: true },
});

module.exports = mongoose.model('Comments', commentsSchema);
