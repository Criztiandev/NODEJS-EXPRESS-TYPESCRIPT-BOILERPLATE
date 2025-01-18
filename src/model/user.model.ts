import mongoose from "mongoose";
import { User } from "../types/models/user";

const userSchema = new mongoose.Schema<User>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  suffix: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

export default mongoose.model("user", userSchema);
