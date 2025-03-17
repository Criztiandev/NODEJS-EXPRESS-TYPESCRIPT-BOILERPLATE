import { Schema } from "mongoose";
import { UserAttributes } from "../../../user/interface/user.interface";

export interface RegistrationCredentials extends UserAttributes {}

export interface RegisterReturn {
  UID: Schema.Types.ObjectId;
}

export interface RegisterTokenPayload {
  UID: Schema.Types.ObjectId;
}
