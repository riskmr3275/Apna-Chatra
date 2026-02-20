import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: String,
    email: String,
    avatar: String
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  likes: [{
    userId: mongoose.Schema.Types.ObjectId,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reports: [{
    userId: mongoose.Schema.Types.ObjectId,
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
commentSchema.index({ articleId: 1 });
commentSchema.index({ 'author.id': 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ createdAt: -1 });

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for reply count
commentSchema.virtual('replyCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
  count: true
});

export default mongoose.model('Comment', commentSchema);