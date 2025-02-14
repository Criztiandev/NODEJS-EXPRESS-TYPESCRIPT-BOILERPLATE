import { Query, Schema, model } from "mongoose";
import { UserDocument } from "../feature/user/interface/user.interface";

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
      default: "user",
      enum: ["user", "admin", "superadmin"],
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

// Pre-middleware with proper typing
userSchema.pre(/^find/, function (this: Query<any, UserDocument>, next) {
  if (!("isDeleted" in this.getFilter())) {
    this.where({ isDeleted: false });
  }
  next();
});

export default model<UserDocument>("User", userSchema);
