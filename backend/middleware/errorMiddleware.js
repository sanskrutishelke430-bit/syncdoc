// errorMiddleware.js — catches errors from any route and sends a clean response
// instead of exposing technical details to the user

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // full error logged on the server for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || 'Something went wrong. Please try again.',
  });
};

module.exports = errorHandler;