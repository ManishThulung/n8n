import mongoose from "mongoose";
import { DATABASE_URL } from ".";

export async function startServer() {
  try {
    await mongoose.connect(DATABASE_URL);

    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
}
