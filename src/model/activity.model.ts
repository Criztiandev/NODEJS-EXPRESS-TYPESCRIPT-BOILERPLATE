import { Schema, model } from "mongoose";
import { Activity } from "../feature/activity/interface/activity.interface";

const activitySchema = new Schema({}, { timestamps: true });

export default model<Activity>("Activity", activitySchema);
