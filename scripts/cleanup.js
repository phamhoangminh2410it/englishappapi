const SearchHistory = require('../models/SearchHistory');
const TopicHistory = require('../models/TopicHistory');

// Hàm xóa dữ liệu cũ
async function cleanupOldData() {
  try {
    // Lấy thời điểm hiện tại theo giờ địa phương
    const now = new Date();
    // Đặt thời gian về 00:00:00 của ngày hôm nay theo giờ địa phương
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Tính thời điểm 24 giờ trước theo giờ địa phương
    const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Xóa lịch sử tìm kiếm cũ
    const searchResult = await SearchHistory.deleteMany({
      updatedAt: { $lt: oneDayAgo }
    });

    // Xóa lịch sử chủ đề cũ
    const topicResult = await TopicHistory.deleteMany({
      updatedAt: { $lt: oneDayAgo }
    });

    console.log(`Đã xóa ${searchResult.deletedCount} bản ghi lịch sử tìm kiếm cũ`);
    console.log(`Đã xóa ${topicResult.deletedCount} bản ghi lịch sử chủ đề cũ`);
    console.log('Thời điểm xóa (giờ địa phương):', oneDayAgo);
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu cũ:', error);
  }
}

module.exports = cleanupOldData; 