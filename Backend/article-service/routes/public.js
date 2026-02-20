import express from 'express';
import Article from '../models/Article.js';
import { getArticleBySlug } from '../controllers/articleController.js';

const router = express.Router();

// Public article routes (no authentication required)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { status: 'published' };
    
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };
    
    if (search) {
      query.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-content'),
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
    console.error('Get public articles error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const articles = await Article.find({ status: 'published' })
      .sort({ 'engagement.views': -1, publishedAt: -1 })
      .limit(parseInt(limit))
      .select('-content');

    res.json({ articles });
  } catch (error) {
    console.error('Get trending articles error:', error);
    res.status(500).json({ error: 'Failed to fetch trending articles' });
  }
});

router.get('/breaking', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const articles = await Article.find({ 
      status: 'published', 
      isBreaking: true 
    })
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .select('-content');

    res.json({ articles });
  } catch (error) {
    console.error('Get breaking news error:', error);
    res.status(500).json({ error: 'Failed to fetch breaking news' });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const articles = await Article.find({ 
      status: 'published', 
      isFeatured: true 
    })
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .select('-content');

    res.json({ articles });
  } catch (error) {
    console.error('Get featured articles error:', error);
    res.status(500).json({ error: 'Failed to fetch featured articles' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Article.distinct('category', { status: 'published' });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/slug/:slug', getArticleBySlug);

export default router;