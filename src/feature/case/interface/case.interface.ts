import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";
import { CaseParty } from "./case-party.interface";

export interface Case {
  _id?: ObjectId | string;
  complainants: CaseParty;
  respondents: CaseParty;
  witnesses?: CaseParty;
  natureOfDispute: string;
  disputeDetails: {
    description: string;
    incidentDate: Date;
    location: string;
  };
  mediationDetails: {
    mediator: ObjectId | string;
    scheduledDate: Date;
    status: "scheduled" | "completed" | "cancelled" | "rescheduled";
    remarks?: string;
  };

  timeline?: {
    action: string;
    date: Date;
    actor: ObjectId | string;
    remarks?: string;
  }[];

  resolution: {
    date: Date;
    type: "settled" | "withdrawn" | "escalated";
    details?: string;
    attachments?: string[];
  };

  status: "filed" | "under_mediation" | "resolved" | "escalated" | "withdrawn";
}

export interface CaseDocument
  extends Omit<Case, "_id">,
    Document,
    SoftDeleteFields {}
