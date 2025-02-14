import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Notification {
  _id?: ObjectId | string;
  recipient: ObjectId | string;
  type: string;
  title: string;
  message: string;
  relatedCase?: ObjectId;
  isRead?: boolean;
  readAt?: Date;
  deliveryMethod: string;
  deliveryStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDocument
  extends Omit<Notification, "_id">,
    Document,
    SoftDeleteFields {}
