import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    location: String,
    dateOfBirth: Date,
    website: String,
    socialLinks: {
      twitter: String,
      facebook: String,
      linkedin: String,
      instagram: String
    }
  },
  preferences: {
    categories: [{
      type: String,
      enum: ['politics', 'sports', 'technology', 'business', 'entertainment', 'health', 'science', 'world', 'local']
    }],
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      breaking: {
        type: Boolean,
        default: true
      },
      weekly: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: String
  },
  bookmarks: [{
    articleId: mongoose.Schema.Types.ObjectId,
    title: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  following: [{
    reporterId: mongoose.Schema.Types.ObjectId,
    reporterName: String,
    followedAt: {
      type: Date,
      default: Date.now
    }
  }],
  readingHistory: [{
    articleId: mongoose.Schema.Types.ObjectId,
    title: String,
    category: String,
    readAt: {
      type: Date,
      default: Date.now
    },
    readTime: Number // in seconds
  }],
  suggestions: [{
    articleId: mongoose.Schema.Types.ObjectId,
    title: String,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    suggestedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
userProfileSchema.index({ userId: 1 });
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ 'bookmarks.articleId': 1 });
userProfileSchema.index({ 'following.reporterId': 1 });

export default mongoose.model('UserProfile', userProfileSchema);