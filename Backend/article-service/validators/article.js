import Joi from 'joi';

export const createArticleSchema = Joi.object({
  title: Joi.string().min(10).max(200).required(),
  content: Joi.string().min(100).required(),
  excerpt: Joi.string().max(500).optional(),
  category: Joi.string().valid(
    'politics', 'sports', 'technology', 'business', 
    'entertainment', 'health', 'science', 'world', 'local'
  ).required(),
  tags: Joi.array().items(Joi.string().min(2).max(30)).max(10).optional(),
  location: Joi.object({
    country: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional()
    }).optional()
  }).optional(),
  media: Joi.object({
    featuredImage: Joi.object({
      url: Joi.string().uri().optional(),
      alt: Joi.string().optional(),
      caption: Joi.string().optional()
    }).optional(),
    images: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().optional(),
      caption: Joi.string().optional()
    })).optional(),
    videos: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      title: Joi.string().optional(),
      duration: Joi.number().positive().optional()
    })).optional()
  }).optional(),
  seo: Joi.object({
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional(),
    keywords: Joi.array().items(Joi.string()).optional()
  }).optional(),
  scheduledFor: Joi.date().greater('now').optional(),
  isBreaking: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional()
});

export const updateArticleSchema = Joi.object({
  title: Joi.string().min(10).max(200).optional(),
  content: Joi.string().min(100).optional(),
  excerpt: Joi.string().max(500).optional(),
  category: Joi.string().valid(
    'politics', 'sports', 'technology', 'business', 
    'entertainment', 'health', 'science', 'world', 'local'
  ).optional(),
  tags: Joi.array().items(Joi.string().min(2).max(30)).max(10).optional(),
  location: Joi.object({
    country: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).optional(),
      longitude: Joi.number().min(-180).max(180).optional()
    }).optional()
  }).optional(),
  media: Joi.object({
    featuredImage: Joi.object({
      url: Joi.string().uri().optional(),
      alt: Joi.string().optional(),
      caption: Joi.string().optional()
    }).optional(),
    images: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().optional(),
      caption: Joi.string().optional()
    })).optional(),
    videos: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      title: Joi.string().optional(),
      duration: Joi.number().positive().optional()
    })).optional()
  }).optional(),
  seo: Joi.object({
    metaTitle: Joi.string().max(60).optional(),
    metaDescription: Joi.string().max(160).optional(),
    keywords: Joi.array().items(Joi.string()).optional()
  }).optional(),
  status: Joi.string().valid('draft', 'pending', 'published', 'archived').optional(),
  scheduledFor: Joi.date().greater('now').optional(),
  isBreaking: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional()
});

export const querySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  category: Joi.string().optional(),
  tags: Joi.string().optional(),
  status: Joi.string().valid('draft', 'pending', 'published', 'rejected', 'archived').optional(),
  author: Joi.string().optional(),
  search: Joi.string().optional(),
  sortBy: Joi.string().valid('createdAt', 'publishedAt', 'views', 'likes').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
  isBreaking: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional()
});