import { Schema, model } from "mongoose";
import { Complainant } from "../feature/complainant/interface/complainant.interface";

const complainantSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    identificationNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<Complainant>("Complainant", complainantSchema);
