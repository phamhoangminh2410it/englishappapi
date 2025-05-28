const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');
const { protect } = require('../middleware/auth');

// Thêm từ mới vào lịch sử tìm kiếm hoặc tăng count nếu đã tồn tại
router.post('/history', protect, async (req, res) => {
  try {
    const { word } = req.body;
    
    if (!word) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập từ cần tìm kiếm'
      });
    }

    // Tìm và cập nhật hoặc tạo mới
    const searchHistory = await SearchHistory.findOneAndUpdate(
      { userId: req.user.id, word: word.toLowerCase() },
      { 
        $inc: { count: 1 },
        $set: { updatedAt: Date.now() }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: searchHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy lịch sử tìm kiếm của user
router.get('/history', protect, async (req, res) => {
  try {
    const searchHistory = await SearchHistory.find({ userId: req.user.id })
      .sort({ count: -1, updatedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: searchHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 