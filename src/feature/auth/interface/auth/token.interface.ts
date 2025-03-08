import { Schema } from "mongoose";

export interface AccessTokenPayload {
  UID: Schema.Types.ObjectId;
}

export interface RefreshTokenPayload {
  UID: Schema.Types.ObjectId;
}
