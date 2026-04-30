const mongoose = require("mongoose");
const { TASK_PRIORITY, TASK_STATUS } = require("../constants/enums");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.MEDIUM
    },
    deadline: {
      type: Date,
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TODO
    },
    comments: [commentSchema]
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        delete returnedObject.__v;
        return returnedObject;
      }
    }
  }
);

taskSchema.index({ project: 1, status: 1, deadline: 1 });
taskSchema.index({ assignedTo: 1, deadline: 1 });

module.exports = mongoose.model("Task", taskSchema);

