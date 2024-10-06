import { validationResult } from 'express-validator';

export const asyncHandler = (fn)=>{
  return (req,res,next)=>{
      fn(req,res,next).catch(error=>{
          return next(new Error(error));
      });
  }

}
export const globalErrorHandel = (err,req,res,next)=>{
  if(process.env.MOOD=='DEV'){
      return res.status(err.cause || 500).json({message:'catch error',stack:err.stack});
  }else{
      return res.status(err.cause || 500).json({message:'catch error',stack:err.stack})
  }
}

export const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.cause) {
    statusCode = err.cause;
    message = err.message;
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate key error: A user with this username or email already exists.',
    });
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

  const isDevelopment = process.env.NODE_ENV === 'development';

  const errorResponse = {
    success: false,
    error: {
      message: message,
      ...(isDevelopment && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(errorResponse);
};
  export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };