import mongoose, {
  Schema,
  Model,
  Document,
  Types,
  Query,
  ObjectId,
  FilterQuery,
} from "mongoose";
import { User } from "../types/models/user";

// Omit _id from User interface when extending Document
export interface UserDocument extends Omit<User, "_id">, Document {}

interface UserModel extends Model<UserDocument> {
  findAllDeletedAccounts(): Promise<UserDocument[]>;
  findDeletedAccountById(id: ObjectId | string): Promise<UserDocument | null>;
  findDeletedAccountByFilter(
    filter: FilterQuery<UserDocument>
  ): Promise<UserDocument | null>;
  findDeletedAccountByEmail(email: string): Promise<UserDocument | null>;
  deleteAccount(id: ObjectId | string): Promise<UserDocument | null>;
  restoreAccount(id: ObjectId | string): Promise<UserDocument | null>;
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
userSchema.pre(
  /^find/,
  function (this: Query<any, Document, {}>, next: (err?: Error) => void) {
    this.where({ isDeleted: false });
    this.select("-isDeleted -deletedAt");
    this.lean();

    next();
  }
);

// Static methods with proper typing
userSchema.statics.findAllDeletedAccounts = function (
  this: Model<UserDocument>
) {
  return this.find({ isDeleted: true });
};

userSchema.statics.findDeletedAccountById = function (id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }
  return this.findOne({ _id: id, isDeleted: true });
};

userSchema.statics.findDeletedAccountByEmail = async function (email: string) {
  // Use the native collection to bypass mongoose middleware
  return this.collection.findOne(
    {
      email: email.toLowerCase(), // Since your schema specifies lowercase
      isDeleted: true,
    },
    {
      projection: {
        password: 0,
        refreshToken: 0,
      },
    }
  );
};

userSchema.statics.findDeletedAccountByFilter = function (
  filter: FilterQuery<UserDocument>
) {
  return this.findOne({ ...filter, isDeleted: true });
};

userSchema.statics.findAllDeletedAccountByFilter = function (
  filter: FilterQuery<UserDocument>
) {
  return this.collection.find({
    ...filter,
    isDeleted: true,
  });
};

userSchema.statics.deleteAccount = async function (id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }
  const user = await this.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return this.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        refreshToken: null,
      },
    },
    { new: true }
  );
};

userSchema.statics.restoreAccount = async function (id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }

  const result = await this.updateOne(
    { _id: new Types.ObjectId(id) },
    {
      $set: {
        isDeleted: false,
        deletedAt: null,
        refreshToken: null,
      },
    }
  );

  console.log("Update result:", result);

  if (result.modifiedCount === 0) {
    throw new Error("Failed to restore account");
  }

  // Fetch and return the updated document
  return await this.findById(id);
};

// Virtual for full name
userSchema.virtual("fullName").get(function (this: UserDocument) {
  const middleName = this.middleName ? ` ${this.middleName} ` : " ";
  return `${this.firstName}${middleName}${this.lastName}`;
});

// Create and export the model
const UserModel = mongoose.model<UserDocument, UserModel>("User", userSchema);
export default UserModel;
