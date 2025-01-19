import { ObjectId } from "mongoose";

export type User = {
  _id?: ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  refreshToken?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
};
