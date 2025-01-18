import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("Mongod URI doest exist");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected on ${conn.connection.host}`);
  } catch (e: Error | any) {
    console.error(`Error: ${e?.message || e}`);
    process.exit(1);
  }
};

export default connectDB;
