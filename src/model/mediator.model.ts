import { Schema, model } from "mongoose";
import { Mediator } from "../feature/mediator/interface/mediator.interface";

const mediatorSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    termStart: {
      type: Date,
      required: true
    },
    termEnd: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

export default model<Mediator>("Mediator", mediatorSchema);
