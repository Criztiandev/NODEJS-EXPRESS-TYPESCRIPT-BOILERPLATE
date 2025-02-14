import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Caseparty {
  _id?: ObjectId | string;
  case: ObjectId | string;
  user: ObjectId | string;
  partyType: string;
  joinedDate?: Date;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CasepartyDocument
  extends Omit<Caseparty, "_id">,
    Document,
    SoftDeleteFields {}
