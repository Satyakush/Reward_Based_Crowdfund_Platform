// server/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error('--- DETAILED ERROR ---');
  console.error('MESSAGE:', err.message);
  console.error('STACK:', err.stack);
  console.error('--------------------');

  res.json({
    message: err.message,
    // We only show the stack trace in development mode for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };