import mongoose from "mongoose";

export async function startServer() {
  try {
    await mongoose.connect(
      "mongodb+srv://db_user:zJ7MG3UAFQh2A0Tn@mycloudapps.ve5dk6q.mongodb.net/n8n?appName=mycloudapps"
    );

    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
}
