
  import { ObjectId } from "mongoose";

  export interface Respondent {
  _id?: ObjectId | string;
  userId: string;
  identificationNumber: string;
}