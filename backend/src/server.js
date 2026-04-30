const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = require("./app");
const connectDB = require("./config/db");

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDB();

    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET is not set. Using the development fallback secret.");
    }

    app.listen(PORT, () => {
      console.log(`Team Task Manager API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the backend server.", error);
    process.exit(1);
  }
}

startServer();
