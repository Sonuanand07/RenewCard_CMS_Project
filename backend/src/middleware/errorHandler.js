const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    error.message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 403;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 403;
    error.message = 'Token expired';
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

module.exports = errorHandler;
