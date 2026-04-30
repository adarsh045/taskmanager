const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyJwt, getJwtSecret } = require("../utils/security");

const requireAuth = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization || "";

  if (!authorizationHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required.");
  }

  const token = authorizationHeader.slice(7).trim();
  const payload = verifyJwt(token, getJwtSecret());
  const user = await User.findById(payload.sub);

  if (!user) {
    throw new ApiError(401, "The authenticated user no longer exists.");
  }

  req.user = user;
  next();
});

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication is required."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action."));
    }

    next();
  };
}

module.exports = {
  requireAuth,
  authorizeRoles
};

