const Event = require('../models/Event');
const Notice = require('../models/Notice');
const User = require('../models/User');

// @desc    Get all events
//          Public/Student: Only gets approved events
//          Admin: Can view all or filter by status
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const { category, search, status, upcomingOnly = 'true', limit } = req.query;

    const query = {};

    // Normal users / students should only see approved events
    // Admins can pass ?status=pending or ?status=all
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      query.status = 'approved';
    } else if (status && status !== 'all') {
      query.status = status;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Upcoming events filter (by date)
    if (upcomingOnly === 'true') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $gte: today };
    }

    // Search filter
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { venue: regex },
        { organizerClub: regex }
      ];
    }

    const pageSize = limit ? parseInt(limit, 10) : 50;

    const events = await Event.find(query)
      .sort({ date: 1, createdAt: -1 })
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving events',
      error: error.message
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Non-admin can only view approved events, unless they are the creator
    const isOwner = req.user && event.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (event.status !== 'approved' && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'This event is pending approval or has been restricted'
      });
    }

    return res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching event details',
      error: error.message
    });
  }
};

// @desc    Create / Propose an event
//          Admin posts are auto-approved.
//          Student / Club Organizer posts are set to 'pending' for Admin approval.
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      organizerClub,
      registrationLink,
      capacity,
      bannerUrl
    } = req.body;

    if (!title || !description || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, date, and venue are required'
      });
    }

    const isAdmin = req.user.role === 'admin';
    const status = isAdmin ? 'approved' : 'pending';

    const event = await Event.create({
      title,
      description,
      category: category || 'Technical',
      date: new Date(date),
      time: time || '10:00 AM',
      venue,
      organizerClub: organizerClub || req.user.clubName || (isAdmin ? 'College Administration' : req.user.name),
      postedBy: req.user._id,
      postedByName: req.user.name,
      status,
      registrationLink: registrationLink || '',
      capacity: capacity ? parseInt(capacity, 10) : 100,
      bannerUrl: bannerUrl || ''
    });

    const msg = isAdmin
      ? 'Event published successfully'
      : 'Event proposal submitted successfully. Awaiting admin review & approval';

    return res.status(201).json({
      success: true,
      data: event,
      message: msg
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating event',
      error: error.message
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Admin or Event Owner)
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = event.postedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event'
      });
    }

    const updateData = {
      title: req.body.title ?? event.title,
      description: req.body.description ?? event.description,
      category: req.body.category ?? event.category,
      date: req.body.date ? new Date(req.body.date) : event.date,
      time: req.body.time ?? event.time,
      venue: req.body.venue ?? event.venue,
      organizerClub: req.body.organizerClub ?? event.organizerClub,
      registrationLink: req.body.registrationLink ?? event.registrationLink,
      capacity: req.body.capacity ?? event.capacity,
      bannerUrl: req.body.bannerUrl ?? event.bannerUrl
    };

    // Only admin can change status directly via PUT
    if (isAdmin && req.body.status) {
      updateData.status = req.body.status;
      updateData.reviewRemarks = req.body.reviewRemarks ?? event.reviewRemarks;
    }

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating event',
      error: error.message
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Admin or Event Owner)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = event.postedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting event',
      error: error.message
    });
  }
};

// @desc    Approve or Reject club event proposal
// @route   PATCH /api/events/:id/review
// @access  Private/Admin
const reviewEvent = async (req, res) => {
  try {
    const { action, remarks } = req.body;

    if (!action || !['approved', 'rejected'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Please specify action as either "approved" or "rejected"'
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event proposal not found'
      });
    }

    event.status = action;
    event.reviewRemarks = remarks || (action === 'approved' ? 'Approved by Admin' : 'Rejected by Admin');
    event.reviewedBy = req.user._id;
    event.reviewedAt = new Date();

    await event.save();

    return res.status(200).json({
      success: true,
      data: event,
      message: `Club event proposal has been ${action}`
    });
  } catch (error) {
    console.error('Error reviewing event:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error reviewing event',
      error: error.message
    });
  }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/events/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalNotices = await Notice.countDocuments();
    const urgentNotices = await Notice.countDocuments({ priority: 'urgent' });
    const totalEvents = await Event.countDocuments();
    const pendingClubApprovals = await Event.countDocuments({ status: 'pending' });
    const approvedEvents = await Event.countDocuments({ status: 'approved' });
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalClubs = await User.countDocuments({ role: 'club_organizer' });

    // Category breakdown for notices
    const noticeCategories = await Notice.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Category breakdown for events
    const eventCategories = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalNotices,
        urgentNotices,
        totalEvents,
        approvedEvents,
        pendingClubApprovals,
        totalUsers,
        totalStudents,
        totalClubs,
        noticeCategories,
        eventCategories
      }
    });
  } catch (error) {
    console.error('Error calculating admin stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching admin statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  reviewEvent,
  getAdminStats
};
