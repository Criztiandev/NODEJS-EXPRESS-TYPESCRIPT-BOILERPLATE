import { Schema } from "mongoose";

const authSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    otpCode: { type: String, required: true },
    isUsed: { type: Boolean, required: false, default: false },
    status: {
      type: String,
      required: false,
      default: "active",
      enum: ["active", "inactive", "onprocess"],
    },

    // auto expire after 10 minutes
    expiredAt: {
      type: Date,
      required: false,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

export default authSchema;
