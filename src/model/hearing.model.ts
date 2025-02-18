import { Schema, model, Query } from "mongoose";
import { HearingDocument } from "../feature/hearing/interface/hearing.interface";

const populateConfig = [
  {
    path: "case",
    select: "-isDeleted -deletedAt",
  },
];

const hearingSchema = new Schema(
  {
    case: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    scheduleDate: {
      type: Date,
      required: true,
    },
    hearingType: {
      type: String,
      enum: ["mediation", "conciliation", "arbitration"],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    venue: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    nextHearingDate: {
      type: Date,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

hearingSchema.pre(["find", "findOne"], function (next) {
  this.populate(populateConfig);
  next();
});

export default model<HearingDocument>("Hearing", hearingSchema);
