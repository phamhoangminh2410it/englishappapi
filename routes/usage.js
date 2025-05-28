const express = require('express');
const router = express.Router();
const UsageTime = require('../models/UsageTime');
const { protect } = require('../middleware/auth');

// Cập nhật thời gian sử dụng
router.post('/time', protect, async (req, res) => {
  try {
    const { minutes } = req.body;
    const today = new Date();
    // Đặt thời gian về 00:00:00 theo giờ địa phương
    today.setHours(0, 0, 0, 0);

    // Tìm và cập nhật hoặc tạo mới
    const usageTime = await UsageTime.findOneAndUpdate(
      { 
        userId: req.user.id, 
        date: today 
      },
      { 
        $inc: { minutes: minutes } // Tăng số phút sử dụng
      },
      { 
        upsert: true, 
        new: true 
      }
    );

    res.status(200).json({
      success: true,
      data: usageTime
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const usageData = await UsageTime.find({
      userId: req.user.id,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: usageData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 