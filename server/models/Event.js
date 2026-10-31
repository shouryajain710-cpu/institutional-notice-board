const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Webinar', 'Other'],
      default: 'Technical',
      required: true
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      default: '10:00 AM'
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true
    },
    organizerClub: {
      type: String,
      default: 'College Administration',
      trim: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    postedByName: {
      type: String,
      default: 'Organizer'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },
    reviewRemarks: {
      type: String,
      default: ''
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    registrationLink: {
      type: String,
      default: ''
    },
    registrationDeadline: {
      type: Date
    },
    capacity: {
      type: Number,
      default: 150
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    bannerUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ title: 'text', description: 'text', venue: 'text' });

module.exports = mongoose.model('Event', eventSchema);
