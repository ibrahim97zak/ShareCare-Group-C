// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err);
  
    // Default error status and message
    let statusCode = 500;
    let message = 'Internal Server Error';
  
    // Handle specific error types
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = err.message;
    } else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized';
    } else if (err.name === 'ForbiddenError') {
      statusCode = 403;
      message = 'Forbidden';
    } else if (err.name === 'NotFoundError') {
      statusCode = 404;
      message = 'Resource Not Found';
    }
  
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
  
    // Prepare the error response
    const errorResponse = {
      success: false,
      error: {
        message: message,
        ...(isDevelopment && { stack: err.stack }) // Include stack trace only in development
      }
    };
  
    // Send the error response
    res.status(statusCode).json(errorResponse);
  };
  
  export default errorHandler;