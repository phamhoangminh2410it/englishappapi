const mongoose = require('mongoose');

const usageTimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  minutes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Tự động xóa sau 30 ngày (30 * 24 * 60 * 60 giây)
  }
});

// Tạo compound index để đảm bảo mỗi user chỉ có một bản ghi cho mỗi ngày
usageTimeSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('UsageTime', usageTimeSchema); 