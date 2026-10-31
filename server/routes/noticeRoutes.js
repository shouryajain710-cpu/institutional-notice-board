const express = require('express');
const router = express.Router();
const {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePinNotice
} = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getAllNotices);
router.get('/:id', getNoticeById);
router.post('/', protect, adminOnly, createNotice);
router.put('/:id', protect, adminOnly, updateNotice);
router.delete('/:id', protect, adminOnly, deleteNotice);
router.patch('/:id/pin', protect, adminOnly, togglePinNotice);

module.exports = router;
