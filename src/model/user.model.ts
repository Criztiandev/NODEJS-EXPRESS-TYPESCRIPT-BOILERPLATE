import mongoose from "mongoose";
import { User } from "../types/models/user";

const userSchema = new mongoose.Schema<
  User & { isDeleted?: boolean; deletedAt?: Date }
>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: false, default: "user" },
  refreshToken: { type: String, required: false },
  isDeleted: { type: Boolean, required: false, default: false },
  deletedAt: { type: Date, required: false },
});

// Create a middleware get all users except deleted users unless i include it in the query
userSchema.pre("find", function (this: any, next: any) {
  this.find({ isDeleted: false });
  next();
});

export default mongoose.model<User & { isDeleted?: boolean; deletedAt?: Date }>(
  "user",
  userSchema
);
