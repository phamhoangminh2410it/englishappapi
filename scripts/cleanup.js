const SearchHistory = require('../models/SearchHistory');
const TopicHistory = require('../models/TopicHistory');

// Hàm xóa dữ liệu cũ
async function cleanupOldData() {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 giờ trước

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
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu cũ:', error);
  }
}

module.exports = cleanupOldData; 