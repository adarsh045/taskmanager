const Task = require("../models/Task");
const { buildAccessibleTaskQuery } = require("../services/task.service");
const { serializeTasks } = require("../utils/taskSerializer");
const { validateTaskFilterQuery } = require("../validators/task.validator");
const asyncHandler = require("../utils/asyncHandler");
const { TASK_STATUS } = require("../constants/enums");

const getOverview = asyncHandler(async (req, res) => {
  validateTaskFilterQuery(req.query);

  const query = await buildAccessibleTaskQuery(req.user, req.query);
  const tasks = await Task.find(query)
    .populate("project", "name")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .sort({ deadline: 1, createdAt: -1 });

  const serializedTasks = serializeTasks(tasks);
  const summary = serializedTasks.reduce(
    (accumulator, task) => {
      accumulator.total += 1;

      if (task.status === TASK_STATUS.TODO) {
        accumulator.todo += 1;
      }

      if (task.status === TASK_STATUS.IN_PROGRESS) {
        accumulator.inProgress += 1;
      }

      if (task.status === TASK_STATUS.COMPLETED) {
        accumulator.completed += 1;
      }

      if (task.isOverdue) {
        accumulator.overdue += 1;
      }

      return accumulator;
    },
    {
      total: 0,
      todo: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0
    }
  );

  res.status(200).json({
    success: true,
    data: {
      summary,
      tasks: serializedTasks
    }
  });
});

module.exports = {
  getOverview
};

