import { Schema } from "mongoose";

export interface OtpTokenPayload {
  UID: Schema.Types.ObjectId;
  email: string;
}
