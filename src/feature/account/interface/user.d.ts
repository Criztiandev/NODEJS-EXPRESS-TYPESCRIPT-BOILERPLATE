import { ObjectId } from "mongoose";

interface User {
  _id: ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  status: string;
  refreshToken: string;
  isDeleted: boolean;
  deletedAt: Date;
}

export default User;
