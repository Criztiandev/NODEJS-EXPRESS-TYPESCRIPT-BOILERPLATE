import mongoose from "mongoose";
import config from "./config";
import { ServerError } from "../utils/error.utils";

const connectDB = async () => {
  try {
    if (!config.MONGO_URI) {
      throw new ServerError("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected on ${conn.connection.host}`);
  } catch (e: unknown) {
    console.error(`Error: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
  }
};

export default connectDB;
