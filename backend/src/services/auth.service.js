const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { getJwtSecret, hashPassword, signJwt, verifyPassword } = require("../utils/security");
const { USER_ROLES } = require("../constants/enums");

function sanitizeUser(userDocument) {
  if (!userDocument) {
    return null;
  }

  const user = userDocument.toJSON ? userDocument.toJSON() : { ...userDocument };
  delete user.password;
  return user;
}

async function resolveRequestedRole(payload) {
  const requestedRole = payload.role;

  if (!requestedRole) {
    const userCount = await User.countDocuments();
    return userCount === 0 ? USER_ROLES.ADMIN : USER_ROLES.MEMBER;
  }

  if (requestedRole === USER_ROLES.ADMIN) {
    const adminExists = await User.exists({ role: USER_ROLES.ADMIN });

    if (adminExists) {
      throw new ApiError(403, "Admin registration is locked. Please use an existing admin account.");
    }
  }

  return requestedRole;
}

function createAuthPayload(userDocument) {
  const safeUser = sanitizeUser(userDocument);
  const token = signJwt(
    {
      sub: String(safeUser._id),
      email: safeUser.email,
      role: safeUser.role
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );

  return {
    token,
    user: safeUser
  };
}

async function registerUser(payload) {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const password = await hashPassword(payload.password);
  const role = await resolveRequestedRole(payload);

  const user = await User.create({
    name: payload.name.trim(),
    email: payload.email.toLowerCase().trim(),
    password,
    role
  });

  return createAuthPayload(user);
}

async function loginUser(payload) {
  const user = await User.findOne({ email: payload.email.toLowerCase().trim() }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await verifyPassword(payload.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (payload.role && payload.role !== user.role) {
    throw new ApiError(403, `This account is registered as ${user.role}. Please choose the correct role.`);
  }

  return createAuthPayload(user);
}

module.exports = {
  sanitizeUser,
  registerUser,
  loginUser
};
