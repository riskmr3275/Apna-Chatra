import mongoose from 'mongoose';
import slugify from 'slugify';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: String,
    email: String
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'rejected', 'archived'],
    default: 'draft'
  },
  category: {
    type: String,
    required: true,
    enum: ['politics', 'sports', 'technology', 'business', 'entertainment', 'health', 'science', 'world', 'local']
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  location: {
    country: String,
    state: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  media: {
    featuredImage: {
      url: String,
      alt: String,
      caption: String
    },
    images: [{
      url: String,
      alt: String,
      caption: String
    }],
    videos: [{
      url: String,
      title: String,
      duration: Number
    }]
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  engagement: {
    views: {
      type: Number,
      default: 0
    },
    likes: [{
      userId: mongoose.Schema.Types.ObjectId,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  publishedAt: Date,
  scheduledFor: Date,
  isBreaking: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  readTime: Number, // in minutes
  aiReview: {
    score: Number,
    feedback: String,
    reviewedAt: Date
  },
  adminReview: {
    reviewedBy: mongoose.Schema.Types.ObjectId,
    reviewedAt: Date,
    feedback: String
  }
}, {
  timestamps: true
});

// Indexes
articleSchema.index({ slug: 1 });
articleSchema.index({ status: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ 'engagement.views': -1 });
articleSchema.index({ 'author.id': 1 });
articleSchema.index({ isBreaking: 1 });
articleSchema.index({ isFeatured: 1 });

// Text search index
articleSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  tags: 'text'
});

// Pre-save middleware to generate slug
articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  
  // Calculate read time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  // Generate excerpt if not provided
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 200) + '...';
  }
  
  next();
});

// Virtual for like count
articleSchema.virtual('likeCount').get(function() {
  return this.engagement.likes.length;
});

// Method to check if user liked the article
articleSchema.methods.isLikedBy = function(userId) {
  return this.engagement.likes.some(like => like.userId.toString() === userId.toString());
};

// Method to toggle like
articleSchema.methods.toggleLike = function(userId) {
  const existingLike = this.engagement.likes.find(like => 
    like.userId.toString() === userId.toString()
  );
  
  if (existingLike) {
    this.engagement.likes.pull(existingLike._id);
    return false; // unliked
  } else {
    this.engagement.likes.push({ userId });
    return true; // liked
  }
};

// Method to increment views
articleSchema.methods.incrementViews = function() {
  this.engagement.views += 1;
  return this.save();
};

export default mongoose.model('Article', articleSchema);