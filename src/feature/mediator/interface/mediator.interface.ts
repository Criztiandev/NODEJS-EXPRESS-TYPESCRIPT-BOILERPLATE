
  import { ObjectId } from "mongoose";

  export interface Mediator {
  _id?: ObjectId | string;
  userId: string;
  position: string;
  termStart: Date;
  termEnd: Date;
  isActive: boolean;
}