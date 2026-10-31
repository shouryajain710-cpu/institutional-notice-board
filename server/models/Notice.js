const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Examination', 'Holiday', 'Academic', 'Placement', 'Sports', 'Cultural', 'General'],
      default: 'General',
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    targetAudience: {
      type: String,
      enum: ['All', 'Students', 'Faculty', 'Final Year'],
      default: 'All'
    },
    department: {
      type: String,
      default: 'All Departments'
    },
    referenceNumber: {
      type: String,
      default: ''
    },
    attachmentUrl: {
      type: String,
      default: ''
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    postedByName: {
      type: String,
      default: 'Administration'
    },
    postedByRole: {
      type: String,
      default: 'admin'
    },
    expiresAt: {
      type: Date
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for high performance search and category filtering
noticeSchema.index({ title: 'text', content: 'text' });
noticeSchema.index({ category: 1, isPinned: -1, createdAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
