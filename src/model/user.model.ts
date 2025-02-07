import mongoose, {
  Schema,
  Model,
  Document,
  Query,
  FilterQuery,
  Types,
} from "mongoose";
import { User } from "../types/models/user";

// Omit _id from User interface when extending Document
export interface UserDocument extends Omit<User, "_id">, Document {}

interface UserModel extends Model<UserDocument> {
  findAllDeletedAccounts(): Promise<UserDocument[]>;
  findDeletedAccountById(
    id: Schema.Types.ObjectId | string
  ): Promise<UserDocument | null>;
  findDeletedAccountByFilter(
    filter: FilterQuery<UserDocument>
  ): Promise<UserDocument | null>;
  softDelete(id: Schema.Types.ObjectId | string): Promise<UserDocument | null>;
  hardDelete(id: string): Promise<UserDocument | null>;
}

const userSchema = new Schema<UserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      required: false,
      default: "user",
      enum: ["user", "admin"],
    },
    refreshToken: { type: String, required: false },
    isDeleted: { type: Boolean, required: false, default: false },
    deletedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

// Middleware to exclude deleted users by default with correct Query typing
userSchema.pre(/^find/, function (this: Query<any, UserDocument>, next) {
  // Only apply isDeleted filter if not explicitly querying for deleted items
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

// Virtual for full name
userSchema.virtual("fullName").get(function (this: UserDocument) {
  const middleName = this.middleName ? ` ${this.middleName} ` : " ";
  return `${this.firstName}${middleName}${this.lastName}`;
});

// Create and export the model
const UserModel = mongoose.model<UserDocument, UserModel>("User", userSchema);
export default UserModel;

// remove all the config on the model such as pre define for maximum usage of the modek
// Finish the OTP tommorow

// Start the barangay management system at barebone
