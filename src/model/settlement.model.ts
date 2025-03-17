import { Schema, model } from "mongoose";
import { SettlementDocument } from "../feature/settlement/interface/settlement.interface";

const settlementSchema = new Schema(
  {
    case: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },

    caseParticipants: {
      type: Schema.Types.ObjectId,
      ref: "CaseParticipants",
      required: true,
    },

    // Settlement type
    type: {
      type: String,
      required: true,
      enum: ["amicable", "mediated", "conciliated", "arbitrated"],
    },

    // Settlement status
    status: {
      type: String,
      required: true,
      enum: [
        "draft", // Initial creation, not yet finalized
        "pending", // Finalized but awaiting signatures
        "signed", // Signed by all parties
        "complied", // Terms have been fulfilled
        "repudiated", // Settlement was rejected during 10-day period
        "non_complied", // Terms were not fulfilled
        "enforced", // Enforcement action taken
      ],
      default: "draft",
    },

    // Important dates
    settlementDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    repudiationDeadline: {
      type: Date,
      required: false,
      default: null,
    },

    complianceDeadline: {
      type: Date,
      required: false,
      default: null,
    },
    // General remarks
    remarks: String,

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default model<SettlementDocument>("Settlement", settlementSchema);
