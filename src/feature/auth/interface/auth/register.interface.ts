import { ObjectId } from "mongoose";

export interface RegisterDTO {
  userId: ObjectId | string;
}
