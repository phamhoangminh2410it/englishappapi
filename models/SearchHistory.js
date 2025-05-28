const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  word: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo compound index để đảm bảo mỗi user chỉ có một bản ghi cho mỗi từ
searchHistorySchema.index({ userId: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('SearchHistory', searchHistorySchema); 