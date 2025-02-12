import { Schema, model } from "mongoose";
import { Barangay } from "../feature/barangay/interface/barangay.interface";

const barangaySchema = new Schema(
  {

  },
  { timestamps: true }
);

export default model<Barangay>("Barangay", barangaySchema);
