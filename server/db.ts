import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🟢 Connected to MongoDB Successfully");
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error);
    throw error; // Let the application handle it (e.g., return a 500 error) instead of crashing the process
  }
}
