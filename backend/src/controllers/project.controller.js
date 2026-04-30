const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { buildProjectAccessQuery } = require("../services/access.service");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { validateMemberMutationPayload, validateProjectPayload } = require("../validators/project.validator");

function dedupeObjectIds(values = []) {
  return Array.from(new Set(values.filter(Boolean).map((value) => String(value))));
}

function getProjectIdFromParams(req) {
  return req.params.id || req.params.projectId;
}

async function assertUsersExist(userIds) {
  const uniqueUserIds = dedupeObjectIds(userIds);

  if (uniqueUserIds.length === 0) {
    return [];
  }

  const users = await User.find({ _id: { $in: uniqueUserIds } });

  if (users.length !== uniqueUserIds.length) {
    throw new ApiError(400, "One or more selected users do not exist.");
  }

  return users;
}

const listProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find(buildProjectAccessQuery(req.user))
    .populate("owner", "name email role")
    .populate("members", "name email role")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: projects
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const projectId = getProjectIdFromParams(req);

  const project = await Project.findOne({
    _id: projectId,
    ...buildProjectAccessQuery(req.user)
  })
    .populate("owner", "name email role")
    .populate("members", "name email role")
    .populate("createdBy", "name email role");

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

const createProject = asyncHandler(async (req, res) => {
  validateProjectPayload(req.body);

  const ownerId = req.body.owner || req.user._id;
  await assertUsersExist([ownerId, ...(req.body.members || [])]);

  const memberIds = dedupeObjectIds([ownerId, ...(req.body.members || [])]);

  const project = await Project.create({
    name: req.body.name.trim(),
    description: req.body.description?.trim() || "",
    owner: ownerId,
    members: memberIds,
    createdBy: req.user._id
  });

  await project.populate("owner", "name email role");
  await project.populate("members", "name email role");
  await project.populate("createdBy", "name email role");

  res.status(201).json({
    success: true,
    message: "Project created successfully.",
    data: project
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const projectId = getProjectIdFromParams(req);

  validateProjectPayload(req.body, { partial: true });

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (req.body.name !== undefined) {
    project.name = req.body.name.trim();
  }

  if (req.body.description !== undefined) {
    project.description = req.body.description?.trim() || "";
  }

  if (req.body.owner) {
    await assertUsersExist([req.body.owner]);

    project.owner = req.body.owner;
    project.members = dedupeObjectIds([req.body.owner, ...project.members]);
  }

  await project.save();
  await project.populate("owner", "name email role");
  await project.populate("members", "name email role");
  await project.populate("createdBy", "name email role");

  res.status(200).json({
    success: true,
    message: "Project updated successfully.",
    data: project
  });
});

const deleteProject = asyncHandler(async (req, res) => {
  const projectId = getProjectIdFromParams(req);
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project and related tasks deleted successfully."
  });
});

const updateProjectMembers = asyncHandler(async (req, res) => {
  const projectId = getProjectIdFromParams(req);

  validateMemberMutationPayload(req.body);

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const { action, userId } = req.body;
  await assertUsersExist([userId]);

  const memberIds = dedupeObjectIds(project.members);

  if (action === "add") {
    project.members = dedupeObjectIds([...memberIds, userId, project.owner]);
  }

  if (action === "remove") {
    if (String(project.owner) === String(userId)) {
      throw new ApiError(400, "The project owner cannot be removed from members.");
    }

    project.members = memberIds.filter((memberId) => memberId !== String(userId));
  }

  await project.save();
  await project.populate("owner", "name email role");
  await project.populate("members", "name email role");
  await project.populate("createdBy", "name email role");

  res.status(200).json({
    success: true,
    message: "Project members updated successfully.",
    data: project
  });
});

module.exports = {
  listProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectMembers
};
