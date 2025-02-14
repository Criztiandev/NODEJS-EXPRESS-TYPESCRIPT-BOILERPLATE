import { Schema, model } from "mongoose";
import { CasepartyDocument } from "../feature/case-party/interface/case-party.interface";

const casepartySchema = new Schema(
  {
    case: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    partyType: {
      type: String,
      required: true,
      enum: ["complainant", "respondent", "witness"],
    },
    joinedDate: {
      type: Date,
      required: false,
      default: Date.now,
    },
    status: {
      type: String,
      required: false,
      enum: ["active", "withdrawn", "resolved"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default model<CasepartyDocument>("Caseparty", casepartySchema);
