const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    
    let statusCode = 500;
    let message = 'Internal Server Error';
  
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate key error: A user with this username or email already exists.',
      });
    }else if (err.name === 'UnauthorizedError') {
      statusCode = 401;
      message = 'Unauthorized';
    } else if (err.name === 'ForbiddenError') {
      statusCode = 403;
      message = 'Forbidden';
    } else if (err.name === 'NotFoundError') {
      statusCode = 404;
      message = 'Resource Not Found';
    }
  
    const isDevelopment = process.env.NODE_ENV === 'development';
  
    const errorResponse = {
      success: false,
      error: {
        message: message,
        ...(isDevelopment && { stack: err.stack }) 
      }
    };
  
    res.status(statusCode).json(errorResponse);
  };
  
  export default errorHandler;