const { TASK_STATUS } = require("../constants/enums");
const { getAccessibleProjectIds, isAdmin } = require("./access.service");
const { serializeTask } = require("../utils/taskSerializer");

async function buildAccessibleTaskQuery(user, filters = {}) {
  const query = {};

  if (!isAdmin(user)) {
    const projectIds = await getAccessibleProjectIds(user);

    query.$or = [
      { project: { $in: projectIds || [] } },
      { assignedTo: user._id }
    ];
  }

  if (filters.projectId) {
    query.project = filters.projectId;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (String(filters.overdue).toLowerCase() === "true") {
    query.deadline = { $lt: new Date() };

    if (!filters.status) {
      query.status = { $ne: TASK_STATUS.COMPLETED };
    }
  }

  return query;
}

function serializeTaskDocument(task) {
  return serializeTask(task);
}

module.exports = {
  buildAccessibleTaskQuery,
  serializeTaskDocument
};

