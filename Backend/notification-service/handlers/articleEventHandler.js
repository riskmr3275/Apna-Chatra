import { sendEmail } from '../services/emailService.js';
import { sendPushNotification } from '../services/pushService.js';

export const handleArticleEvents = async (event, routingKey) => {
  console.log(`📰 Processing article event: ${routingKey}`);
  
  switch (routingKey) {
    case 'article.published':
      await handleArticlePublished(event);
      break;
    case 'article.liked':
      await handleArticleLiked(event);
      break;
    case 'comment.created':
      await handleCommentCreated(event);
      break;
    default:
      console.log(`Unhandled article event: ${routingKey}`);
  }
};

const handleArticlePublished = async (event) => {
  try {
    // Notify followers of the reporter
    await sendPushNotification({
      topic: `reporter_${event.authorId}`,
      title: 'New Article Published',
      body: `${event.title}`,
      data: {
        type: 'article_published',
        articleId: event.articleId,
        authorId: event.authorId
      }
    });
    
    // Send breaking news notifications if applicable
    if (event.isBreaking) {
      await sendPushNotification({
        topic: 'breaking_news',
        title: '🚨 Breaking News',
        body: event.title,
        data: {
          type: 'breaking_news',
          articleId: event.articleId
        }
      });
    }
  } catch (error) {
    console.error('Error sending article published notifications:', error);
  }
};

const handleArticleLiked = async (event) => {
  try {
    // Notify article author about the like
    await sendPushNotification({
      userId: event.authorId,
      title: 'Article Liked',
      body: 'Someone liked your article!',
      data: {
        type: 'article_liked',
        articleId: event.articleId,
        likerId: event.userId
      }
    });
  } catch (error) {
    console.error('Error sending like notification:', error);
  }
};

const handleCommentCreated = async (event) => {
  try {
    // Notify article author about new comment
    await sendPushNotification({
      userId: event.authorId,
      title: 'New Comment',
      body: 'Someone commented on your article',
      data: {
        type: 'comment_created',
        articleId: event.articleId,
        commentId: event.commentId,
        commenterId: event.authorId
      }
    });
  } catch (error) {
    console.error('Error sending comment notification:', error);
  }
};