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

    fullAddress: {
      street: String,
      barangay: String,
      city: String,
      province: String,
      postalCode: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: ["resident", "barangayOfficial", "dilgOfficial", "admin"],
      default: "resident",
      required: true,
    },
    role: {
      type: String,
      required: false,
      default: "user",
      enum: ["user", "admin", "superadmin"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      required: false,
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

userSchema.pre(/^find/, function (this: Query<any, UserDocument>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }

  // Dont get the admin and superadmin and even in the count of d
  if (
    this.getFilter().role !== "admin" &&
    this.getFilter().role !== "superadmin"
  ) {
    this.where({ role: { $nin: ["admin", "super-admin"] } });
  }

  next();
});

// middleware to exclude the admin and superadmin in the count of documents and isDeleted is false
userSchema.pre(
  /^countDocuments/,
  function (this: Query<any, UserDocument>, next) {
    this.where({ role: { $nin: ["admin", "super-admin"] }, isDeleted: true });
    next();
  }
);

export default model<UserDocument>("User", userSchema);
