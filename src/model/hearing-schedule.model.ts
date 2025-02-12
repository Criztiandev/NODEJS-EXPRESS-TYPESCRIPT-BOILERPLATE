import { Schema, model } from "mongoose";
import { HearingSchedule } from "../feature/hearing-schedule/interface/hearing-schedule.interface";

const hearingscheduleSchema = new Schema(
  {
    caseId: { type: String, required: true, ref: "Case" },
    scheduledDate: { type: Date, required: true },
    status: { type: String, required: true },
    venue: { type: String, required: true },
    notes: { type: String, required: false },
    scheduledBy: { type: String, required: true, ref: "User" },
  },
  { timestamps: true }
);

export default model<HearingSchedule>("HearingSchedule", hearingscheduleSchema);
