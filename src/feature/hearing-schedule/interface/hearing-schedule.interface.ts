import { ObjectId } from "mongoose";

export interface HearingSchedule {
  _id?: ObjectId | string;
  caseId: string;
  scheduledDate: Date;
  status: string;
  venue: string;
  notes?: string;
  scheduledBy: string;
}
