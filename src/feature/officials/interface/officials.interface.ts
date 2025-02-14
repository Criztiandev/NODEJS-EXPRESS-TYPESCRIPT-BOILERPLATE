import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Officials {
  _id?: ObjectId | string;
  user: string;
  barangay: string;
  position: string;
  termStart: Date;
  termEnd: Date;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfficialsDocument
  extends Omit<Officials, "_id">,
    Document,
    SoftDeleteFields {}
