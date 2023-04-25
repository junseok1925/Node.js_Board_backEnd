const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  postId: { type: String, required: true },
});

module.exports = mongoose.model('Comments', commentsSchema);
