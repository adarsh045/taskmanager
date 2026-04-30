const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ name: 1, createdAt: 1 });

  res.status(200).json({
    success: true,
    data: users
  });
});

module.exports = {
  listUsers
};

