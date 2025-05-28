require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const topicRoutes = require('./routes/topic');
const usageRoutes = require('./routes/usage');
const cleanupOldData = require('./scripts/cleanup');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/topic', topicRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/admin', require('./routes/admin'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newdemo')
  .then(() => {
    console.log('MongoDB Connected');
    
    // Lên lịch chạy cleanup mỗi ngày vào lúc 00:00
    cron.schedule('0 0 * * *', async () => {
      console.log('Bắt đầu xóa dữ liệu cũ...');
      await cleanupOldData();
      console.log('Hoàn thành xóa dữ liệu cũ');
    });
  })
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 