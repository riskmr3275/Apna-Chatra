import Article from '../models/Article.js';
import Comment from '../models/Comment.js';
import { publishEvent } from '../config/rabbitmq.js';
import { 
  createArticleSchema, 
  updateArticleSchema, 
  querySchema 
} from '../validators/article.js';

export const createArticle = async (req, res) => {
  try {
    const { error, value } = createArticleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const article = new Article({
      ...value,
      author: {
        id: req.user.userId,
        name: req.user.name || 'Anonymous',
        email: req.user.email
      }
    });

    await article.save();

    // Publish article created event
    await publishEvent('article.events', 'article.created', {
      articleId: article._id,
      authorId: article.author.id,
      title: article.title,
      category: article.category,
      status: article.status
    });

    res.status(201).json({
      message: 'Article created successfully',
      article
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
};

export const getArticles = async (req, res) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      page = 1,
      limit = 10,
      category,
      tags,
      status,
      author,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      isBreaking,
      isFeatured
    } = value;

    // Build query
    const query = {};
    
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };
    if (status) query.status = status;
    if (author) query['author.id'] = author;
    if (isBreaking !== undefined) query.isBreaking = isBreaking;
    if (isFeatured !== undefined) query.isFeatured = isFeatured;
    
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-content'), // Exclude full content for list view
      Article.countDocuments(query)
    ]);

    res.json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment views if not the author
    if (req.user?.userId !== article.author.id.toString()) {
      await article.incrementViews();
    }

    res.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const article = await Article.findOne({ slug, status: 'published' });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment views
    await article.incrementViews();

    res.json({ article });
  } catch (error) {
    console.error('Get article by slug error:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = updateArticleSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if user can update this article
    if (article.author.id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this article' });
    }

    Object.assign(article, value);
    await article.save();

    // Publish article updated event
    await publishEvent('article.events', 'article.updated', {
      articleId: article._id,
      authorId: article.author.id,
      title: article.title,
      status: article.status,
      updatedBy: req.user.userId
    });

    res.json({
      message: 'Article updated successfully',
      article
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if user can delete this article
    if (article.author.id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this article' });
    }

    await Article.findByIdAndDelete(id);
    await Comment.deleteMany({ articleId: id });

    // Publish article deleted event
    await publishEvent('article.events', 'article.deleted', {
      articleId: id,
      authorId: article.author.id,
      title: article.title,
      deletedBy: req.user.userId
    });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

export const likeArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const isLiked = article.toggleLike(req.user.userId);
    await article.save();

    // Publish like event
    await publishEvent('article.events', isLiked ? 'article.liked' : 'article.unliked', {
      articleId: id,
      userId: req.user.userId,
      authorId: article.author.id
    });

    res.json({
      message: isLiked ? 'Article liked' : 'Article unliked',
      isLiked,
      likeCount: article.likeCount
    });
  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({ error: 'Failed to like article' });
  }
};

export const publishArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Check if user can publish this article
    if (article.author.id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to publish this article' });
    }

    article.status = 'published';
    article.publishedAt = new Date();
    await article.save();

    // Publish article published event
    await publishEvent('article.events', 'article.published', {
      articleId: article._id,
      authorId: article.author.id,
      title: article.title,
      category: article.category,
      publishedAt: article.publishedAt
    });

    res.json({
      message: 'Article published successfully',
      article
    });
  } catch (error) {
    console.error('Publish article error:', error);
    res.status(500).json({ error: 'Failed to publish article' });
  }
};