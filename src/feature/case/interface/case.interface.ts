import { CaseStatus } from "../constants";
import { Document, ObjectId } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";
import { Participants } from "../../case-participants/interface/case-participants.interface";

export interface Case {
  caseNumber: string;
  participants: ObjectId | string;

  natureOfDispute: string;

  disputeDetails: {
    type: string;
    description: string;
    incidentDate: Date;
    location: string;
  };

  mediationDetails: {
    mediator: ObjectId | string;
    scheduledDate: Date;
    status: string;
    remarks: string;
  };

  timeline?: {
    action: string;
    date: Date;
    actor: ObjectId | string;
    remarks: string;
  }[];

  settlement?: {
    date: Date;
    type: string;
    remarks: string;
  };

  status: typeof CaseStatus;
}

export interface CaseDocument
  extends Omit<Case, "_id">,
    Document,
    SoftDeleteFields {}

export interface CaseDocumentWithParticipants
  extends Omit<CaseDocument, "participants"> {
  participants: Participants;
}

export interface CaseWithParticipants extends Omit<Case, "participants"> {
  participants: {
    complainants: string[];
    respondents: string[];
    witnesses: string[];
  };
}
