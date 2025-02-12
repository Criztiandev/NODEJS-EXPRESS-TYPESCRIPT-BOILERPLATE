import { ObjectId } from "mongoose";

export type User = {
  _id?: ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;

  email: string;
  phoneNumber: string;
  password: string;

  fullAddress?: string;
  barangay: string;
  city: string;

  role: string;
  status?: string;
  refreshToken?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
};
