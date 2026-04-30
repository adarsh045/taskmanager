const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured.");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB connected to ${mongoose.connection.name}`);
}

module.exports = connectDB;

