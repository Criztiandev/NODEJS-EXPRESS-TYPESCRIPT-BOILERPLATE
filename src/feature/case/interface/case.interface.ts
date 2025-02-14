import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Case {
  _id?: ObjectId | string;
  title: string;
  description: string;
  caseNumber: string;
  barangay: ObjectId | string;
  caseType: string;
  natureOfDispute: string;
  filingDate?: Date;
  status?: string;
  isResolved?: boolean;
  daysPending?: number;
  complainants?: ObjectId | string[];
  respondents?: ObjectId | string[];
  assignedMediator?: ObjectId | string;
  escalationReason?: string;
  escalationDate?: Date;
  resolutionDate?: Date;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseDocument
  extends Omit<Case, "_id">,
    Document,
    SoftDeleteFields {}
