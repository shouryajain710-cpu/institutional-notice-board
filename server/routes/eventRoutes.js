const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  reviewEvent,
  getAdminStats
} = require('../controllers/eventController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Stats for dashboard
router.get('/admin/stats', protect, adminOnly, getAdminStats);

// Event listings and detail
router.get('/', optionalAuth, getAllEvents);
router.get('/:id', optionalAuth, getEventById);

// Create event (Admin publishes directly, Student/Club Organizer submits proposal)
router.post('/', protect, createEvent);

// Update / Delete
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

// Admin review action (approve/reject)
router.patch('/:id/review', protect, adminOnly, reviewEvent);

module.exports = router;
