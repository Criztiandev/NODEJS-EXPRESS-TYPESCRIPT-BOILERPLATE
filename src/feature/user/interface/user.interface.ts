// user.interface.ts
import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface User {
  _id?: ObjectId | string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  role?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Make sure UserDocument extends both Document and SoftDeleteFields
export interface UserDocument
  extends Omit<User, "_id">,
    Document,
    SoftDeleteFields {}
