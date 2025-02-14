import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Settlement {
  _id?: ObjectId | string;
  case: ObjectId | string;
  settlementDate: Date;
  settlementType: string;
  terms: string;
  isComplied?: boolean;
  complianceDate?: Date;
  witnesses?: ObjectId[] | string[];
  mediator: ObjectId | string;
  document?: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettlementDocument
  extends Omit<Settlement, "_id">,
    Document,
    SoftDeleteFields {}
