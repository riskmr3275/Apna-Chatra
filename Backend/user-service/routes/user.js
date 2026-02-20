import express from 'express';
import {
  getProfile,
  updateProfile,
  getBookmarks,
  addBookmark,
  removeBookmark,
  followReporter,
  unfollowReporter,
  getNewsFeed,
  suggestNews
} from '../controllers/userController.js';

const router = express.Router();

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Bookmark routes
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks', addBookmark);
router.delete('/bookmarks/:articleId', removeBookmark);

// Follow routes
router.post('/follow', followReporter);
router.delete('/follow/:reporterId', unfollowReporter);

// News feed
router.get('/feed', getNewsFeed);

// Suggestions
router.post('/suggest', suggestNews);

export default router;