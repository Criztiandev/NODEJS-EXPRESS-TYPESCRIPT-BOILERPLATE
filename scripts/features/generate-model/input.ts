import { Schema } from "mongoose";

const ModelInput = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: false },
  startDate: { type: Date, required: true },
});

export default ModelInput;
