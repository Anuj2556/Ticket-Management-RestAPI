function errorResponse(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message: statusCode === 500
        ? "Internal server error"
        : err.message || "Request failed",
    },
  });
}

module.exports = errorResponse;