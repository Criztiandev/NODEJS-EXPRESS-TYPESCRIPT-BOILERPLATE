import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Hearing {
  _id?: ObjectId | string;
  case: ObjectId | string;
  scheduleDate: Date;
  hearingType: string;
  status?: string;
  venue: string;
  attendees?: any[];
  mediator?: ObjectId | string;
  notes?: string;
  nextHearingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HearingDocument
  extends Omit<Hearing, "_id">,
    Document,
    SoftDeleteFields {}
