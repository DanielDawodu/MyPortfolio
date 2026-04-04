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
    console.log("🕒 Connecting to MongoDB...");
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });
    isConnected = true;
    console.log(`🟢 Connected to MongoDB Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error);
    // Log the full URI (obscured password) to check if it's being parsed correctly
    const obscuredUri = MONGODB_URI.replace(/:([^@]+)@/, ":****@");
    console.error(`📍 Attempted URI: ${obscuredUri}`);
    throw error;
  }
}
