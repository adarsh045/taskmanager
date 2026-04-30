const mongoose = require("mongoose");
const { TASK_PRIORITY, TASK_STATUS } = require("../constants/enums");
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

function validateDate(value, fieldName, errors) {
  if (value && Number.isNaN(Date.parse(value))) {
    errors.push(`${fieldName} must be a valid date.`);
  }
}

function validateTaskPayload(payload) {
  const errors = [];

  if (typeof payload.title !== "string" || payload.title.trim().length < 2) {
    errors.push("Task title must be at least 2 characters long.");
  }

  if (payload.description !== undefined && typeof payload.description !== "string") {
    errors.push("Task description must be a string.");
  }

  if (!Object.values(TASK_PRIORITY).includes(payload.priority)) {
    errors.push("Task priority is invalid.");
  }

  if (!payload.deadline) {
    errors.push("Task deadline is required.");
  } else {
    validateDate(payload.deadline, "Deadline", errors);
  }

  if (payload.status && !Object.values(TASK_STATUS).includes(payload.status)) {
    errors.push("Task status is invalid.");
  }

  if (!payload.project) {
    errors.push("Project is required.");
  } else {
    validateObjectId(payload.project, "Project", errors);
  }

  if (!payload.assignedTo) {
    errors.push("Assigned user is required.");
  } else {
    validateObjectId(payload.assignedTo, "Assigned user", errors);
  }

  throwValidationError(errors);
}

function validateTaskUpdatePayload(payload, options = {}) {
  const errors = [];
  const memberMode = Boolean(options.memberMode);

  if (memberMode) {
    if (!payload.status || !Object.values(TASK_STATUS).includes(payload.status)) {
      errors.push("A valid task status is required.");
    }

    throwValidationError(errors);
    return;
  }

  if (payload.title !== undefined && (typeof payload.title !== "string" || payload.title.trim().length < 2)) {
    errors.push("Task title must be at least 2 characters long.");
  }

  if (payload.description !== undefined && typeof payload.description !== "string") {
    errors.push("Task description must be a string.");
  }

  if (payload.priority !== undefined && !Object.values(TASK_PRIORITY).includes(payload.priority)) {
    errors.push("Task priority is invalid.");
  }

  if (payload.status !== undefined && !Object.values(TASK_STATUS).includes(payload.status)) {
    errors.push("Task status is invalid.");
  }

  validateDate(payload.deadline, "Deadline", errors);
  validateObjectId(payload.project, "Project", errors);
  validateObjectId(payload.assignedTo, "Assigned user", errors);

  throwValidationError(errors);
}

function validateCommentPayload(payload) {
  const errors = [];

  if (typeof payload.message !== "string" || payload.message.trim().length < 1) {
    errors.push("Comment message is required.");
  }

  throwValidationError(errors);
}

function validateTaskFilterQuery(query) {
  const errors = [];

  if (query.status && !Object.values(TASK_STATUS).includes(query.status)) {
    errors.push("Status filter is invalid.");
  }

  if (query.priority && !Object.values(TASK_PRIORITY).includes(query.priority)) {
    errors.push("Priority filter is invalid.");
  }

  validateObjectId(query.projectId, "Project filter", errors);
  validateObjectId(query.assignedTo, "Assigned user filter", errors);

  if (
    query.overdue !== undefined &&
    !["true", "false"].includes(String(query.overdue).toLowerCase())
  ) {
    errors.push("Overdue filter must be true or false.");
  }

  throwValidationError(errors);
}

module.exports = {
  validateTaskPayload,
  validateTaskUpdatePayload,
  validateCommentPayload,
  validateTaskFilterQuery
};
