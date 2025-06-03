const express = require('express');
const router = express.Router();
const UsageTime = require('../models/UsageTime');
const { protect } = require('../middleware/auth');

// Cập nhật thời gian sử dụng
router.post('/time', protect, async (req, res) => {
  try {
    const { minutes } = req.body;
    
    // Lấy thời điểm hiện tại và đặt về 00:00:00 theo giờ địa phương
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tìm và cập nhật hoặc tạo mới
    const usageTime = await UsageTime.findOneAndUpdate(
      { 
        userId: req.user.id, 
        date: today 
      },
      { 
        $inc: { minutes: minutes }
      },
      { 
        upsert: true, 
        new: true 
      }
    );

    // Chuyển đổi thời gian về ISO string
    const result = {
      ...usageTime.toObject(),
      date: usageTime.date.toISOString(),
      createdAt: usageTime.createdAt.toISOString()
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Lấy thời gian sử dụng trong 30 ngày gần nhất
router.get('/time', protect, async (req, res) => {
  try {
    // Lấy thời điểm hiện tại và đặt về 00:00:00 của 30 ngày trước theo giờ địa phương
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const usageData = await UsageTime.find({
      userId: req.user.id,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    // Chuyển đổi thời gian về ISO string cho tất cả kết quả
    const results = usageData.map(item => ({
      ...item.toObject(),
      date: item.date.toISOString(),
      createdAt: item.createdAt.toISOString()
    }));

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 