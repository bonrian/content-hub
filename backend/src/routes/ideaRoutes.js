const express = require('express');
const router = express.Router();
const {
  getAllIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  getStats
} = require('../controllers/ideaController');
const { protect } = require('../middleware/auth');

/**
 * Routes cho Ideas
 * Tất cả routes đều require authentication
 */

// Áp dụng protect middleware cho tất cả routes
router.use(protect);

// GET /api/ideas/stats - Lấy thống kê (phải đặt trước /:id)
router.get('/stats', getStats);

// GET /api/ideas - Lấy tất cả ý tưởng (có pagination, filter)
// POST /api/ideas - Tạo ý tưởng mới
router.route('/')
  .get(getAllIdeas)
  .post(createIdea);

// GET /api/ideas/:id - Lấy một ý tưởng
// PUT /api/ideas/:id - Cập nhật ý tưởng
// DELETE /api/ideas/:id - Xóa ý tưởng
router.route('/:id')
  .get(getIdeaById)
  .put(updateIdea)
  .delete(deleteIdea);

module.exports = router;

