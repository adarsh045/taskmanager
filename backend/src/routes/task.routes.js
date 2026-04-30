const express = require("express");
const {
  addComment,
  createTask,
  deleteComment,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask
} = require("../controllers/task.controller");
const { USER_ROLES } = require("../constants/enums");
const { authorizeRoles, requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", listTasks);
router.get("/:id", getTaskById);
router.post("/", authorizeRoles(USER_ROLES.ADMIN), createTask);
router.put("/:id", updateTask);
router.patch("/:id", updateTask);
router.delete("/:id", authorizeRoles(USER_ROLES.ADMIN), deleteTask);
router.post("/:id/comments", addComment);
router.delete("/:id/comments/:commentId", deleteComment);

module.exports = router;
