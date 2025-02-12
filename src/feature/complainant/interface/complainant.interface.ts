
  import { ObjectId } from "mongoose";

  export interface Complainant {
  _id?: ObjectId | string;
  userId: string;
  identificationNumber: string;
}