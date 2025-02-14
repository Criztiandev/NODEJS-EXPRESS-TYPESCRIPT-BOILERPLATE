import { Schema, model, Query } from "mongoose";
import { HearingDocument } from "../feature/hearing/interface/hearing.interface";

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
    attendees: [
      {
        party: {
          type: Schema.Types.ObjectId,
          ref: "CaseParty",
        },
        attended: Boolean,
        remarks: String,
      },
    ],
    mediator: {
      type: Schema.Types.ObjectId,
      ref: "Officials",
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

// Middleware to exclude deleted documents by default
hearingSchema.pre(/^find/, function (this: Query<any, HearingDocument>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

export default model<HearingDocument>("Hearing", hearingSchema);
