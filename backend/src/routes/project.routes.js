const express = require("express");
const {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject,
  updateProjectMembers
} = require("../controllers/project.controller");
const { USER_ROLES } = require("../constants/enums");
const { authorizeRoles, requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", listProjects);
router.get("/:id", getProjectById);
router.post("/", authorizeRoles(USER_ROLES.ADMIN), createProject);
router.put("/:id", authorizeRoles(USER_ROLES.ADMIN), updateProject);
router.patch("/:id", authorizeRoles(USER_ROLES.ADMIN), updateProject);
router.patch("/:id/members", authorizeRoles(USER_ROLES.ADMIN), updateProjectMembers);
router.delete("/:id", authorizeRoles(USER_ROLES.ADMIN), deleteProject);

module.exports = router;
