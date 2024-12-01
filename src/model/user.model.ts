import mongoose from "mongoose";
import { UserSchameValue } from "../interface/user.interface";

const userSchema = new mongoose.Schema<UserSchameValue>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("user", userSchema);
