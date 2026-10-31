const Notice = require('../models/Notice');

// @desc    Get all notices (with optional category, search, priority filters)
// @route   GET /api/notices
// @access  Public
const getAllNotices = async (req, res) => {
  try {
    const { category, search, priority, audience, department, limit, page = 1 } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Audience filter (if provided)
    if (audience && audience !== 'All') {
      query.$or = [{ targetAudience: 'All' }, { targetAudience: audience }];
    }

    // Department filter
    if (department && department !== 'All') {
      query.$or = [
        ...(query.$or || []),
        { department: 'All Departments' },
        { department: department }
      ];
    }

    // Search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { department: searchRegex },
        { referenceNumber: searchRegex }
      ];
    }

    const pageSize = limit ? parseInt(limit, 10) : 50;
    const skip = (parseInt(page, 10) - 1) * pageSize;

    // Sort by pinned first (-1), then by newest creation date (-1)
    const notices = await Notice.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const total = await Notice.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: notices.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / pageSize),
      data: notices
    });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving notices',
      error: error.message
    });
  }
};

// @desc    Get single notice by ID
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: notice
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching notice details',
      error: error.message
    });
  }
};

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      priority,
      isPinned,
      targetAudience,
      department,
      referenceNumber,
      attachmentUrl,
      expiresAt
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the notice'
      });
    }

    const notice = await Notice.create({
      title,
      content,
      category: category || 'General',
      priority: priority || 'normal',
      isPinned: !!isPinned,
      targetAudience: targetAudience || 'All',
      department: department || 'All Departments',
      referenceNumber: referenceNumber || `NOT-${Date.now().toString().slice(-6)}`,
      attachmentUrl: attachmentUrl || '',
      postedBy: req.user._id,
      postedByName: req.user.name,
      postedByRole: req.user.role,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    return res.status(201).json({
      success: true,
      data: notice,
      message: 'Notice published successfully'
    });
  } catch (error) {
    console.error('Error creating notice:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating notice',
      error: error.message
    });
  }
};

// @desc    Update an existing notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = async (req, res) => {
  try {
    let notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    const updatedFields = {
      title: req.body.title ?? notice.title,
      content: req.body.content ?? notice.content,
      category: req.body.category ?? notice.category,
      priority: req.body.priority ?? notice.priority,
      isPinned: req.body.isPinned !== undefined ? req.body.isPinned : notice.isPinned,
      targetAudience: req.body.targetAudience ?? notice.targetAudience,
      department: req.body.department ?? notice.department,
      referenceNumber: req.body.referenceNumber ?? notice.referenceNumber,
      attachmentUrl: req.body.attachmentUrl ?? notice.attachmentUrl,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : notice.expiresAt
    };

    notice = await Notice.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      data: notice,
      message: 'Notice updated successfully'
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating notice',
      error: error.message
    });
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting notice',
      error: error.message
    });
  }
};

// @desc    Toggle pinned status of a notice
// @route   PATCH /api/notices/:id/pin
// @access  Private/Admin
const togglePinNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    notice.isPinned = !notice.isPinned;
    await notice.save();

    return res.status(200).json({
      success: true,
      data: notice,
      message: notice.isPinned ? 'Notice pinned to top' : 'Notice unpinned'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating pin status',
      error: error.message
    });
  }
};

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePinNotice
};
