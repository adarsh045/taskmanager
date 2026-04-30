const USER_ROLES = Object.freeze({
  ADMIN: "Admin",
  MEMBER: "Member"
});

const TASK_STATUS = Object.freeze({
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed"
});

const TASK_PRIORITY = Object.freeze({
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent"
});

module.exports = {
  USER_ROLES,
  TASK_STATUS,
  TASK_PRIORITY
};

