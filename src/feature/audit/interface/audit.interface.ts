import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Audit {
  _id?: ObjectId | string;
  action: string;
  actionMessage?: string;
  entityType: string;
  entityId: ObjectId | string;
  changes: {
    before?: any;
    after?: any;
  };
  ipAddress?: string;
  userAgent?: string;
  createdBy: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditDocument
  extends Omit<Audit, "_id">,
    Document,
    SoftDeleteFields {}
