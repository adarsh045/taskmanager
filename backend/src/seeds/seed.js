const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { TASK_PRIORITY, TASK_STATUS, USER_ROLES } = require("../constants/enums");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { hashPassword } = require("../utils/security");

async function upsertUser({ name, email, role, password }) {
  const hashedPassword = await hashPassword(password);

  return User.findOneAndUpdate(
    { email },
    {
      name,
      email,
      role,
      password: hashedPassword
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true
    }
  );
}

async function upsertTask({ projectId, title, description, priority, deadline, assignedTo, createdBy, status, comments }) {
  return Task.findOneAndUpdate(
    { project: projectId, title },
    {
      project: projectId,
      title,
      description,
      priority,
      deadline,
      assignedTo,
      createdBy,
      status,
      comments
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true
    }
  );
}

async function seed() {
  await connectDB();

  const admin = await upsertUser({
    name: "Ava Admin",
    email: "ava.admin@assignment1.dev",
    role: USER_ROLES.ADMIN,
    password: "Password123"
  });

  const memberOne = await upsertUser({
    name: "Mason Member",
    email: "mason.member@assignment1.dev",
    role: USER_ROLES.MEMBER,
    password: "Password123"
  });

  const memberTwo = await upsertUser({
    name: "Nina Member",
    email: "nina.member@assignment1.dev",
    role: USER_ROLES.MEMBER,
    password: "Password123"
  });

  const project = await Project.findOneAndUpdate(
    { name: "Launch Operations Hub" },
    {
      name: "Launch Operations Hub",
      description:
        "Coordinate release readiness, user communication, and backlog cleanup before the next milestone.",
      owner: admin._id,
      members: [admin._id, memberOne._id, memberTwo._id],
      createdBy: admin._id
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true
    }
  );

  await upsertTask({
    projectId: project._id,
    title: "Finalize release checklist",
    description: "Review open risks, publish the checklist, and confirm each owner has signed off.",
    priority: TASK_PRIORITY.HIGH,
    deadline: new Date("2026-05-08T00:00:00.000Z"),
    assignedTo: memberOne._id,
    createdBy: admin._id,
    status: TASK_STATUS.IN_PROGRESS,
    comments: [
      {
        author: admin._id,
        message: "Please confirm blocker status before tomorrow's standup."
      },
      {
        author: memberOne._id,
        message: "Checklist is drafted. Waiting on final QA confirmation."
      }
    ]
  });

  await upsertTask({
    projectId: project._id,
    title: "Prepare stakeholder update",
    description: "Create a concise summary covering release timing, remaining risks, and support readiness.",
    priority: TASK_PRIORITY.MEDIUM,
    deadline: new Date("2026-05-10T00:00:00.000Z"),
    assignedTo: memberTwo._id,
    createdBy: admin._id,
    status: TASK_STATUS.TODO,
    comments: [
      {
        author: admin._id,
        message: "Keep the update short enough for email and slide form."
      }
    ]
  });

  console.log("Sample data is ready.");
  console.log("Admin login: ava.admin@assignment1.dev / Password123");
  console.log("Member login: mason.member@assignment1.dev / Password123");
  console.log("Member login: nina.member@assignment1.dev / Password123");
}

seed()
  .catch((error) => {
    console.error("Sample data seeding failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
