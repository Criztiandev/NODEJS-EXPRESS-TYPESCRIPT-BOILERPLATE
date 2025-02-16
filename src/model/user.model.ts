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
  // // Get the current operation options
  // const options = this.getOptions();
  // // Skip the middleware if we explicitly want to include deleted items
  // if (options.includeSoftDeleted) {
  //   return next();
  // }
  // // Only apply the filter if it's not already specified
  // if (!("isDeleted" in this.getFilter())) {
  //   this.where({ isDeleted: false });
  // }
  // next();
  // // Dont get the admin and superadmin
  // if (
  //   this.getFilter().role !== "admin" &&
  //   this.getFilter().role !== "superadmin"
  // ) {
  //   this.where({ role: { $nin: ["admin", "super-admin"] } });
  // }
});

export default model<UserDocument>("User", userSchema);
