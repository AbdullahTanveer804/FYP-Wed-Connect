import mongoose, { connections } from "mongoose";

interface IConnection {
  isConnected?: number;
}

const connection: IConnection = {};

async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error: any) {
    console.error("Database connection failed!", error.message);
    process.exit(1);
  }
}

export default connectDB;