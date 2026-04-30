const Project = require("../models/Project");
const Task = require("../models/Task");
const { USER_ROLES } = require("../constants/enums");
const ApiError = require("../utils/ApiError");

function isAdmin(user) {
  return user?.role === USER_ROLES.ADMIN;
}

function buildProjectAccessQuery(user) {
  if (isAdmin(user)) {
    return {};
  }

  return {
    $or: [{ owner: user._id }, { members: user._id }]
  };
}

async function getAccessibleProjectIds(user) {
  if (isAdmin(user)) {
    return null;
  }

  const projects = await Project.find(buildProjectAccessQuery(user)).select("_id");
  return projects.map((project) => project._id);
}

async function ensureTaskAccess(taskId, user) {
  const task = await Task.findById(taskId).populate("project", "name owner members");

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  if (isAdmin(user)) {
    return task;
  }

  const isProjectOwner = String(task.project.owner) === String(user._id);
  const isProjectMember = task.project.members.some((memberId) => String(memberId) === String(user._id));
  const isAssignedUser = String(task.assignedTo) === String(user._id);

  if (!isProjectOwner && !isProjectMember && !isAssignedUser) {
    throw new ApiError(403, "You do not have access to this task.");
  }

  return task;
}

module.exports = {
  isAdmin,
  buildProjectAccessQuery,
  getAccessibleProjectIds,
  ensureTaskAccess
};

