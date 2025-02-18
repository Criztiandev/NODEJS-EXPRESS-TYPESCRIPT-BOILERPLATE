import { ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";

export interface CaseParty {
  _id?: ObjectId | string;
  residents: ObjectId[];
  partyType: "complainant" | "respondent" | "witness";
  status: "active" | "withdrawn" | "resolved";
  withdrawalDate?: Date;
  remarks?: string;
}

export interface CasePartyDocument
  extends CaseParty,
    Document,
    SoftDeleteFields {}
