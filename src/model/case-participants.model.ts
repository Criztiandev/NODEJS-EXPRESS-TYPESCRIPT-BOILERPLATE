import { Schema, model } from "mongoose";
import { CaseParticipantsDocument } from "../feature/case-participants/interface/case-participants.interface";

const caseParticipantsSchema = new Schema(
  {
    case: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },

    complainants: [
      {
        resident: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: ["active", "withdrawn"],
          default: "active",
        },
        joinedDate: {
          type: Date,
          default: Date.now,
        },
        withdrawalDate: Date,
        withdrawalReason: String,
        remarks: String,
      },
    ],

    respondents: [
      {
        resident: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: ["active", "withdrawn"],
          default: "active",
        },
        joinedDate: {
          type: Date,
          default: Date.now,
        },
        withdrawalDate: Date,
        withdrawalReason: String,
        remarks: String,
      },
    ],

    witnesses: [
      {
        resident: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        status: {
          type: String,
          required: true,
          enum: ["active", "withdrawn"],
          default: "active",
        },
        joinedDate: {
          type: Date,
          default: Date.now,
        },
        withdrawalDate: Date,
        withdrawalReason: String,
        remarks: String,
      },
    ],

    isDeleted: {
      type: Boolean,
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<CaseParticipantsDocument>(
  "Caseparticipants",
  caseParticipantsSchema
);
