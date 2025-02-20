import { Document, ObjectId, Types } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface Participants {
  resident: ObjectId | string;
  status: string;
  joinedDate: Date;
  withdrawalDate: Date;
  withdrawalReason: string;
  remarks: string;
}

export interface CaseParticipants {
  _id?: ObjectId | string;
  case: ObjectId | string;
  complainants: Participants[];
  respondents: Participants[];
  witnesses: Participants[];
}

export interface CaseParticipantsInput {
  case: ObjectId | Types.ObjectId;
  participants: {
    complainants: string[];
    respondents: string[];
    witnesses?: string[];
  };
}
export interface CaseParticipantsDocument
  extends Omit<CaseParticipants, "_id">,
    Document,
    SoftDeleteFields {}
