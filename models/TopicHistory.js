const mongoose = require('mongoose');

const topicHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topicName: {
    type: String,
    required: true
  },
  icon: {
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

// Tạo compound index để đảm bảo mỗi user chỉ có một bản ghi cho mỗi chủ đề
topicHistorySchema.index({ userId: 1, topicName: 1 }, { unique: true });

module.exports = mongoose.model('TopicHistory', topicHistorySchema); 