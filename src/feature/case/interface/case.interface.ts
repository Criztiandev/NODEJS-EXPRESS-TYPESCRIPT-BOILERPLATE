import { Document, ObjectId } from "mongoose";
  import { SoftDeleteFields } from "../../../core/base/repository/base.repository";
  
  export interface Case {
    _id?: ObjectId | string;
    title: string;
  description: string;
  status: string;
  priority?: string;
  startDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CaseDocument extends Omit<Case, "_id">, Document, SoftDeleteFields {}
