export const extractUserInfo = (req, res, next) => {
  // Extract user info from headers set by API Gateway
  if (req.headers['x-user-id']) {
    req.user = {
      userId: req.headers['x-user-id'],
      role: req.headers['x-user-role'],
      email: req.headers['x-user-email']
    };
  }
  next();
};