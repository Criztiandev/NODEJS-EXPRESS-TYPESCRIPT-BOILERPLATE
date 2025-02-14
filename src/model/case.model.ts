import { Schema, model, Query } from "mongoose";
import { CaseDocument } from "../feature/case/interface/case.interface";

const caseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    caseNumber: {
      type: String,
      required: true,
    },
    barangay: {
      type: Schema.Types.ObjectId,
      ref: "Barangay",
      required: true,
    },
    caseType: {
      type: String,
      required: true,
      enum: ["civil", "criminal", "others"],
      default: "civil",
    },
    natureOfDispute: {
      type: String,
      required: true,
      trim: true,
    },
    filingDate: {
      type: Date,
      required: false,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        "filed",
        "underReview",
        "scheduledForHearing",
        "inMediation",
        "resolved",
        "escalated",
        "closed",
      ],
      default: "filed",
    },
    isResolved: {
      type: Boolean,
      required: false,
      default: false,
    },
    daysPending: {
      type: Number,
      required: false,
      default: 0,
    },
    complainants: [
      {
        type: Schema.Types.ObjectId,
        ref: "CaseParty",
      },
    ],
    respondents: [
      {
        type: Schema.Types.ObjectId,
        ref: "CaseParty",
      },
    ],
    assignedMediator: {
      type: Schema.Types.ObjectId,
      ref: "BarangayOfficial",
      required: false,
    },
    escalationReason: {
      type: String,
      required: false,
    },
    escalationDate: {
      type: Date,
      required: false,
    },
    resolutionDate: {
      type: Date,
      required: false,
    },
    remarks: {
      type: String,
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
caseSchema.pre(/^find/, function (this: Query<any, CaseDocument>, next) {
  const conditions = this.getFilter();
  if (!("isDeleted" in conditions)) {
    this.where({ isDeleted: false });
  }
  next();
});

export default model<CaseDocument>("Case", caseSchema);
