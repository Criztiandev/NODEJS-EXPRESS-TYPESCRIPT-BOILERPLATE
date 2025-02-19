import { Document } from "mongoose";
import { SoftDeleteFields } from "../../../core/base/repository/base.repository";
import { HearingInput } from "../validation/hearing.validation";

export interface Hearing extends HearingInput {}

export interface HearingDocument
  extends Omit<Hearing, "_id">,
    Document,
    SoftDeleteFields {}
