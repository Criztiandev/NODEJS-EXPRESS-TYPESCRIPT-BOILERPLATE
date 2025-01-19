import { ObjectId } from "mongoose";

export type User = {
  _id?: ObjectId | string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};
