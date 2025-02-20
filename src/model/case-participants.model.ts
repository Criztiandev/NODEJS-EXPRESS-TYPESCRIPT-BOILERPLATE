import { Schema, model } from "mongoose";
import { CaseParticipantsDocument } from "../feature/case-participants/interface/case-participants.interface";

const populateConfig = [
  {
    path: "complainants.resident",
    select: "firstName lastName middleName fullAddress email phoneNumber",
    // Include virtuals in the populate
    options: { virtuals: true },
  },
  {
    path: "respondents.resident",
    select: "firstName lastName middleName fullAddress email phoneNumber",
    options: { virtuals: true },
  },
  {
    path: "witnesses.resident",
    select: "firstName lastName middleName fullAddress email phoneNumber",
    options: { virtuals: true },
  },
];

const ParticipantSchema = new Schema({
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
});

const caseParticipantsSchema = new Schema(
  {
    case: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },

    complainants: [ParticipantSchema],
    respondents: [ParticipantSchema],
    witnesses: [ParticipantSchema],

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

// Populate the caseParticipants field in the Case model
caseParticipantsSchema.pre(["find", "findOne"], function (next) {
  this.populate(populateConfig);
  next();
});

export default model<CaseParticipantsDocument>(
  "CaseParticipants",
  caseParticipantsSchema
);
