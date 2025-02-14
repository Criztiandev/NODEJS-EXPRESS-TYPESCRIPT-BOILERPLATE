import { Schema } from "mongoose";

const ModelInput = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    required: true,
    enum: ["case", "document", "hearing", "settlement", "user", "barangay"],
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  changes: {
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
  },
  ipAddress: String,
  userAgent: String,
});

export default ModelInput;
