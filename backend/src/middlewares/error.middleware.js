const ApiError = require("../utils/ApiError");

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  let normalizedError = error;

  if (error.name === "CastError") {
    normalizedError = new ApiError(400, "Invalid resource identifier.");
  }

  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
    normalizedError = new ApiError(409, `${duplicateField} already exists.`);
  }

  const statusCode = normalizedError.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: normalizedError.message || "Something went wrong.",
    details: normalizedError.details || [],
    stack: process.env.NODE_ENV === "development" ? normalizedError.stack : undefined
  });
}

module.exports = {
  notFound,
  errorHandler
};

