const ApiError = require("../utils/ApiError");
const { USER_ROLES } = require("../constants/enums");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function throwValidationError(errors) {
  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed.", errors);
  }
}

function validateSignupPayload(payload) {
  const errors = [];

  if (typeof payload.name !== "string" || payload.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long.");
  }

  if (typeof payload.email !== "string" || !emailRegex.test(payload.email.trim())) {
    errors.push("A valid email address is required.");
  }

  if (typeof payload.password !== "string" || payload.password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (payload.role !== undefined && !Object.values(USER_ROLES).includes(payload.role)) {
    errors.push("Role must be either Admin or Member.");
  }

  throwValidationError(errors);
}

function validateLoginPayload(payload) {
  const errors = [];

  if (typeof payload.email !== "string" || !emailRegex.test(payload.email.trim())) {
    errors.push("A valid email address is required.");
  }

  if (typeof payload.password !== "string" || payload.password.length === 0) {
    errors.push("Password is required.");
  }

  if (payload.role !== undefined && !Object.values(USER_ROLES).includes(payload.role)) {
    errors.push("Role must be either Admin or Member.");
  }

  throwValidationError(errors);
}

module.exports = {
  validateSignupPayload,
  validateLoginPayload
};
