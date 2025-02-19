import { Schema } from "mongoose";

const ModelInput = new Schema({
  case: {
    type: Schema.Types.ObjectId,
    ref: "Case",
    required: true,
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  partyType: {
    type: String,
    required: true,
    enum: [
      "complainant",
      "respondent",
      "witness",
      "mediator",
      "pangkat_member",
    ],
    index: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "withdrawn", "resolved"],
    default: "active",
  },
  joinedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  withdrawalDate: Date,
  remarks: String,
});

export default ModelInput;
