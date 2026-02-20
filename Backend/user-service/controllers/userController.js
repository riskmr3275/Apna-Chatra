import UserProfile from '../models/UserProfile.js';
import { publishEvent } from '../config/rabbitmq.js';
import axios from 'axios';

export const getProfile = async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.user.userId });
    
    if (!profile) {
      // Create profile if it doesn't exist
      profile = new UserProfile({
        userId: req.user.userId,
        email: req.user.email
      });
      await profile.save();
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profile: profileData, preferences } = req.body;

    let profile = await UserProfile.findOne({ userId: req.user.userId });
    
    if (!profile) {
      profile = new UserProfile({
        userId: req.user.userId,
        email: req.user.email
      });
    }

    if (profileData) {
      profile.profile = { ...profile.profile, ...profileData };
    }

    if (preferences) {
      profile.preferences = { ...profile.preferences, ...preferences };
    }

    await profile.save();

    // Publish profile updated event
    await publishEvent('user.events', 'user.profile.updated', {
      userId: req.user.userId,
      profile: profile.profile,
      preferences: profile.preferences
    });

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const profile = await UserProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      return res.json({ bookmarks: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } });
    }

    const skip = (page - 1) * limit;
    const bookmarks = profile.bookmarks
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(skip, skip + parseInt(limit));

    res.json({
      bookmarks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: profile.bookmarks.length,
        pages: Math.ceil(profile.bookmarks.length / limit)
      }
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
};

export const addBookmark = async (req, res) => {
  try {
    const { articleId, title } = req.body;

    if (!articleId || !title) {
      return res.status(400).json({ error: 'Article ID and title are required' });
    }

    let profile = await UserProfile.findOne({ userId: req.user.userId });
    
    if (!profile) {
      profile = new UserProfile({
        userId: req.user.userId,
        email: req.user.email
      });
    }

    // Check if already bookmarked
    const existingBookmark = profile.bookmarks.find(
      bookmark => bookmark.articleId.toString() === articleId
    );

    if (existingBookmark) {
      return res.status(409).json({ error: 'Article already bookmarked' });
    }

    profile.bookmarks.push({ articleId, title });
    await profile.save();

    // Publish bookmark added event
    await publishEvent('user.events', 'user.bookmark.added', {
      userId: req.user.userId,
      articleId,
      title
    });

    res.json({ message: 'Article bookmarked successfully' });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;

    const profile = await UserProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const bookmarkIndex = profile.bookmarks.findIndex(
      bookmark => bookmark.articleId.toString() === articleId
    );

    if (bookmarkIndex === -1) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    profile.bookmarks.splice(bookmarkIndex, 1);
    await profile.save();

    // Publish bookmark removed event
    await publishEvent('user.events', 'user.bookmark.removed', {
      userId: req.user.userId,
      articleId
    });

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
};

export const followReporter = async (req, res) => {
  try {
    const { reporterId, reporterName } = req.body;

    if (!reporterId || !reporterName) {
      return res.status(400).json({ error: 'Reporter ID and name are required' });
    }

    let profile = await UserProfile.findOne({ userId: req.user.userId });
    
    if (!profile) {
      profile = new UserProfile({
        userId: req.user.userId,
        email: req.user.email
      });
    }

    // Check if already following
    const existingFollow = profile.following.find(
      follow => follow.reporterId.toString() === reporterId
    );

    if (existingFollow) {
      return res.status(409).json({ error: 'Already following this reporter' });
    }

    profile.following.push({ reporterId, reporterName });
    await profile.save();

    // Publish follow event
    await publishEvent('user.events', 'user.reporter.followed', {
      userId: req.user.userId,
      reporterId,
      reporterName
    });

    res.json({ message: 'Reporter followed successfully' });
  } catch (error) {
    console.error('Follow reporter error:', error);
    res.status(500).json({ error: 'Failed to follow reporter' });
  }
};

export const unfollowReporter = async (req, res) => {
  try {
    const { reporterId } = req.params;

    const profile = await UserProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const followIndex = profile.following.findIndex(
      follow => follow.reporterId.toString() === reporterId
    );

    if (followIndex === -1) {
      return res.status(404).json({ error: 'Not following this reporter' });
    }

    profile.following.splice(followIndex, 1);
    await profile.save();

    // Publish unfollow event
    await publishEvent('user.events', 'user.reporter.unfollowed', {
      userId: req.user.userId,
      reporterId
    });

    res.json({ message: 'Reporter unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow reporter error:', error);
    res.status(500).json({ error: 'Failed to unfollow reporter' });
  }
};

export const getNewsFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const profile = await UserProfile.findOne({ userId: req.user.userId });
    
    // Build query parameters based on user preferences
    const queryParams = new URLSearchParams({
      page,
      limit,
      status: 'published'
    });

    if (profile?.preferences?.categories?.length > 0) {
      queryParams.append('category', profile.preferences.categories.join(','));
    }

    // Get articles from Article Service
    const response = await axios.get(
      `${process.env.ARTICLE_SERVICE_URL}/api/v1/articles/public?${queryParams}`,
      {
        headers: {
          'x-user-id': req.user.userId,
          'x-user-role': req.user.role
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Get news feed error:', error);
    res.status(500).json({ error: 'Failed to fetch news feed' });
  }
};

export const suggestNews = async (req, res) => {
  try {
    const { articleId, title, reason } = req.body;

    if (!articleId || !title || !reason) {
      return res.status(400).json({ error: 'Article ID, title, and reason are required' });
    }

    let profile = await UserProfile.findOne({ userId: req.user.userId });
    
    if (!profile) {
      profile = new UserProfile({
        userId: req.user.userId,
        email: req.user.email
      });
    }

    profile.suggestions.push({ articleId, title, reason });
    await profile.save();

    // Publish suggestion event
    await publishEvent('user.events', 'user.news.suggested', {
      userId: req.user.userId,
      articleId,
      title,
      reason
    });

    res.json({ message: 'News suggestion submitted successfully' });
  } catch (error) {
    console.error('Suggest news error:', error);
    res.status(500).json({ error: 'Failed to submit suggestion' });
  }
};