export const errorHandler = (err, req, res, next) => {
  console.error('Notification Service Error:', err);

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};