const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: Date, // createdAt 필드 추가
});

module.exports = mongoose.model('Posts', postsSchema);
