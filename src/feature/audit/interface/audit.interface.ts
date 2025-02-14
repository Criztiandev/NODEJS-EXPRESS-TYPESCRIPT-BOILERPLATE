import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Audit {
  _id?: ObjectId | string;
  user: undefined;
  action: string;
  entityType: string;
  entityId: undefined;
  changes: {
    before?: any;
    after?: any;
  };
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditDocument
  extends Omit<Audit, "_id">,
    Document,
    SoftDeleteFields {}
