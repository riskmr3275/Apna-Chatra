import express from 'express';
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  likeArticle,
  publishArticle
} from '../controllers/articleController.js';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment
} from '../controllers/commentController.js';

const router = express.Router();

// Article routes
router.post('/', createArticle);
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.post('/:id/like', likeArticle);
router.post('/:id/publish', publishArticle);

// Comment routes
router.post('/:id/comments', createComment);
router.get('/:id/comments', getComments);
router.put('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);
router.post('/comments/:commentId/like', likeComment);

export default router;