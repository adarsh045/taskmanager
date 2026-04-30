const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { TASK_STATUS, USER_ROLES } = require("../constants/enums");
const { buildAccessibleTaskQuery, serializeTaskDocument } = require("../services/task.service");
const { ensureTaskAccess, isAdmin } = require("../services/access.service");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  validateCommentPayload,
  validateTaskFilterQuery,
  validateTaskPayload,
  validateTaskUpdatePayload
} = require("../validators/task.validator");

function getTaskIdFromParams(req) {
  return req.params.id || req.params.taskId;
}

async function assertProjectAndAssignee(projectId, assigneeId) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const assignee = await User.findById(assigneeId);

  if (!assignee) {
    throw new ApiError(400, "The selected assignee does not exist.");
  }

  const isMember = project.members.some((memberId) => String(memberId) === String(assigneeId));

  if (!isMember) {
    throw new ApiError(400, "The assignee must be a member of the selected project.");
  }

  return project;
}

async function populateTask(task) {
  await task.populate("project", "name owner members");
  await task.populate("assignedTo", "name email role");
  await task.populate("createdBy", "name email role");
  await task.populate("comments.author", "name email role");

  return serializeTaskDocument(task);
}

const listTasks = asyncHandler(async (req, res) => {
  validateTaskFilterQuery(req.query);

  const query = await buildAccessibleTaskQuery(req.user, req.query);
  const tasks = await Task.find(query)
    .populate("project", "name")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .populate("comments.author", "name email role")
    .sort({ deadline: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: tasks.map((task) => serializeTaskDocument(task))
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await ensureTaskAccess(getTaskIdFromParams(req), req.user);
  const serializedTask = await populateTask(task);

  res.status(200).json({
    success: true,
    data: serializedTask
  });
});

const createTask = asyncHandler(async (req, res) => {
  validateTaskPayload(req.body);

  await assertProjectAndAssignee(req.body.project, req.body.assignedTo);

  const task = await Task.create({
    title: req.body.title.trim(),
    description: req.body.description?.trim() || "",
    priority: req.body.priority,
    deadline: req.body.deadline,
    status: req.body.status || TASK_STATUS.TODO,
    project: req.body.project,
    assignedTo: req.body.assignedTo,
    createdBy: req.user._id
  });

  const serializedTask = await populateTask(task);

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: serializedTask
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(getTaskIdFromParams(req));

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const adminUser = isAdmin(req.user);

  if (!adminUser && String(task.assignedTo) !== String(req.user._id)) {
    throw new ApiError(403, "You can only update tasks assigned to you.");
  }

  if (adminUser) {
    validateTaskUpdatePayload(req.body);

    const nextProjectId = req.body.project || task.project;
    const nextAssigneeId = req.body.assignedTo || task.assignedTo;

    await assertProjectAndAssignee(nextProjectId, nextAssigneeId);

    if (req.body.title !== undefined) {
      task.title = req.body.title.trim();
    }

    if (req.body.description !== undefined) {
      task.description = req.body.description?.trim() || "";
    }

    if (req.body.priority !== undefined) {
      task.priority = req.body.priority;
    }

    if (req.body.deadline !== undefined) {
      task.deadline = req.body.deadline;
    }

    if (req.body.status !== undefined) {
      task.status = req.body.status;
    }

    if (req.body.project !== undefined) {
      task.project = req.body.project;
    }

    if (req.body.assignedTo !== undefined) {
      task.assignedTo = req.body.assignedTo;
    }
  } else {
    const allowedFields = ["status"];
    const invalidFields = Object.keys(req.body).filter((field) => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      throw new ApiError(403, "Members can only update their task status.");
    }

    validateTaskUpdatePayload(req.body, { memberMode: true });
    task.status = req.body.status;
  }

  await task.save();

  const serializedTask = await populateTask(task);

  res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    data: serializedTask
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(getTaskIdFromParams(req));

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully."
  });
});

const addComment = asyncHandler(async (req, res) => {
  validateCommentPayload(req.body);

  const task = await ensureTaskAccess(getTaskIdFromParams(req), req.user);

  task.comments.push({
    author: req.user._id,
    message: req.body.message.trim()
  });

  await task.save();

  const serializedTask = await populateTask(task);

  res.status(201).json({
    success: true,
    message: "Comment added successfully.",
    data: serializedTask
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const task = await ensureTaskAccess(getTaskIdFromParams(req), req.user);
  const comment = task.comments.id(req.params.commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  const ownsComment = String(comment.author) === String(req.user._id);

  if (!ownsComment && req.user.role !== USER_ROLES.ADMIN) {
    throw new ApiError(403, "You can only delete your own comments.");
  }

  comment.deleteOne();
  await task.save();

  const serializedTask = await populateTask(task);

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully.",
    data: serializedTask
  });
});

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  deleteComment
};
