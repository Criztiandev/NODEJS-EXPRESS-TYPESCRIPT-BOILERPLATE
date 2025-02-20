import { Schema } from "mongoose";

const ModelInput = new Schema({
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
  // Case overall status to handle party withdrawals
  caseStatus: {
    type: String,
    required: true,
    enum: [
      "active", // Case is ongoing normally
      "complainant_withdrawn", // When complainant withdraws
      "respondent_withdrawn", // When respondent withdraws
      "both_withdrawn", // When both parties withdraw
      "resolved", // Case is resolved
      "dismissed", // Case is dismissed
    ],
    default: "active",
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

export default ModelInput;
