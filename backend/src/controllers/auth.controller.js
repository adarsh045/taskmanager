const asyncHandler = require("../utils/asyncHandler");
const { loginUser, registerUser, sanitizeUser } = require("../services/auth.service");
const { validateLoginPayload, validateSignupPayload } = require("../validators/auth.validator");

const signup = asyncHandler(async (req, res) => {
  validateSignupPayload(req.body);

  const authPayload = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: authPayload
  });
});

const login = asyncHandler(async (req, res) => {
  validateLoginPayload(req.body);

  const authPayload = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: authPayload
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: sanitizeUser(req.user)
  });
});

module.exports = {
  signup,
  login,
  getCurrentUser
};

