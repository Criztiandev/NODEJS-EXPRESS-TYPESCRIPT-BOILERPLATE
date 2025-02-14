import { Schema, model } from "mongoose";
import { Respondent } from "../feature/respondent/interface/respondent.interface";

const respondentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    identificationNumber: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default model<Respondent>("Respondent", respondentSchema);
