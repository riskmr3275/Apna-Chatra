export const errorHandler = (err, req, res, next) => {
  console.error('API Gateway Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // Proxy errors
  if (err.code === 'ECONNREFUSED') {
    error = {
      message: 'Service temporarily unavailable',
      status: 503
    };
  }

  // Rate limit errors
  if (err.status === 429) {
    error = {
      message: 'Too many requests, please try again later',
      status: 429
    };
  }

  res.status(error.status).json({
    error: error.message,
    timestamp: new Date().toISOString(),
    path: req.path
  });
};