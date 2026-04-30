const { TASK_STATUS } = require("../constants/enums");

function serializeTask(taskDocument) {
  const task = taskDocument.toJSON ? taskDocument.toJSON() : { ...taskDocument };
  const deadline = task.deadline ? new Date(task.deadline) : null;

  return {
    ...task,
    isOverdue: Boolean(deadline && deadline < new Date() && task.status !== TASK_STATUS.COMPLETED)
  };
}

function serializeTasks(taskDocuments = []) {
  return taskDocuments.map((taskDocument) => serializeTask(taskDocument));
}

module.exports = {
  serializeTask,
  serializeTasks
};

