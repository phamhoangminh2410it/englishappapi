const express = require('express');
const router = express.Router();
const TopicHistory = require('../models/TopicHistory');
const { protect } = require('../middleware/auth');

// Thêm hoặc cập nhật chủ đề được theo dõi
router.post('/history', protect, async (req, res) => {
  try {
    const { topicName, icon } = req.body;
    
    if (!topicName || !icon) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin chủ đề'
      });
    }

    // Tìm và cập nhật hoặc tạo mới
    const topicHistory = await TopicHistory.findOneAndUpdate(
      { userId: req.user.id, topicName },
      { 
        $inc: { count: 1 },
        $set: { 
          icon,
          updatedAt: Date.now() 
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: topicHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy danh sách chủ đề được theo dõi
router.get('/history', protect, async (req, res) => {
  try {
    const topicHistory = await TopicHistory.find({ userId: req.user.id })
      .sort({ count: -1, updatedAt: -1 })
      .limit(5); // Giới hạn 5 chủ đề được theo dõi nhiều nhất

    res.status(200).json({
      success: true,
      data: topicHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 