import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("🟡 Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("🟢 Connected to MongoDB Successfully");
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error);
    throw error; // Let the application handle it (e.g., return a 500 error) instead of crashing the process
  }
}
