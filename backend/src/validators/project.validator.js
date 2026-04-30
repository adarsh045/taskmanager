const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

function throwValidationError(errors) {
  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed.", errors);
  }
}

function validateObjectId(value, fieldName, errors) {
  if (value && !mongoose.Types.ObjectId.isValid(value)) {
    errors.push(`${fieldName} must be a valid identifier.`);
  }
}

function validateProjectPayload(payload, options = {}) {
  const errors = [];
  const isPartial = Boolean(options.partial);

  if (!isPartial || payload.name !== undefined) {
    if (typeof payload.name !== "string" || payload.name.trim().length < 2) {
      errors.push("Project name must be at least 2 characters long.");
    }
  }

  if (payload.description !== undefined && typeof payload.description !== "string") {
    errors.push("Project description must be a string.");
  }

  validateObjectId(payload.owner, "Owner", errors);

  if (payload.members !== undefined) {
    if (!Array.isArray(payload.members)) {
      errors.push("Members must be an array of user identifiers.");
    } else {
      payload.members.forEach((memberId) => validateObjectId(memberId, "Member", errors));
    }
  }

  throwValidationError(errors);
}

function validateMemberMutationPayload(payload) {
  const errors = [];

  if (!["add", "remove"].includes(payload.action)) {
    errors.push("Action must be either add or remove.");
  }

  if (!payload.userId) {
    errors.push("User is required.");
  } else {
    validateObjectId(payload.userId, "User", errors);
  }

  throwValidationError(errors);
}

module.exports = {
  validateProjectPayload,
  validateMemberMutationPayload
};
