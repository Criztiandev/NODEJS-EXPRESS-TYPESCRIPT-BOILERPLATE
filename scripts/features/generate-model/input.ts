import { Schema } from "mongoose";

const ModelInput = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    barangay: {
      type: Schema.Types.ObjectId,
      ref: "Barangay",
      required: true,
    },
    position: {
      type: String,
      required: true,
      enum: ["chairman", "secretary", "kagawad", "luponMember"],
    },
    termStart: {
      type: Date,
      required: true,
    },
    termEnd: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    certifications: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Case Schema
const caseSchema = new Schema({
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
    unique: true,
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
  },
  natureOfDispute: {
    type: String,
    required: true,
    trim: true,
  },
  filingDate: {
    type: Date,
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
    default: false,
  },
  daysPending: {
    type: Number,
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
  },
  escalationReason: String,
  escalationDate: Date,
  resolutionDate: Date,
  remarks: String,
});

export default ModelInput;
