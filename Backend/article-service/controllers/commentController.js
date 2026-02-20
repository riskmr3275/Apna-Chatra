import Comment from '../models/Comment.js';
import Article from '../models/Article.js';
import { publishEvent } from '../config/rabbitmq.js';
import { createCommentSchema, updateCommentSchema } from '../validators/comment.js';

export const createComment = async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const { error, value } = createCommentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const comment = new Comment({
      articleId,
      author: {
        id: req.user.userId,
        name: req.user.name || 'Anonymous',
        email: req.user.email,
        avatar: req.user.avatar
      },
      content: value.content,
      parentComment: value.parentComment
    });

    await comment.save();

    // Update article comment count
    await Article.findByIdAndUpdate(articleId, {
      $inc: { 'engagement.comments': 1 }
    });

    // Publish comment created event
    await publishEvent('article.events', 'comment.created', {
      commentId: comment._id,
      articleId,
      authorId: comment.author.id,
      content: comment.content,
      parentComment: comment.parentComment
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const getComments = async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = { 
      articleId, 
      isApproved: true,
      parentComment: { $exists: false } // Only top-level comments
    };

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('replyCount'),
      Comment.countDocuments(query)
    ]);

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id,
          isApproved: true
        })
        .sort({ createdAt: 1 })
        .limit(5); // Limit replies shown initially

        return {
          ...comment.toObject(),
          replies,
          hasMoreReplies: replies.length === 5
        };
      })
    );

    res.json({
      comments: commentsWithReplies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { error, value } = updateCommentSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user can update this comment
    if (comment.author.id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }

    comment.content = value.content;
    await comment.save();

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user can delete this comment
    if (comment.author.id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    // Update article comment count
    await Article.findByIdAndUpdate(comment.articleId, {
      $inc: { 'engagement.comments': -1 }
    });

    // Publish comment deleted event
    await publishEvent('article.events', 'comment.deleted', {
      commentId,
      articleId: comment.articleId,
      deletedBy: req.user.userId
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const existingLike = comment.likes.find(like => 
      like.userId.toString() === req.user.userId
    );

    let isLiked;
    if (existingLike) {
      comment.likes.pull(existingLike._id);
      isLiked = false;
    } else {
      comment.likes.push({ userId: req.user.userId });
      isLiked = true;
    }

    await comment.save();

    res.json({
      message: isLiked ? 'Comment liked' : 'Comment unliked',
      isLiked,
      likeCount: comment.likeCount
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ error: 'Failed to like comment' });
  }
};