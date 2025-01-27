import mongoose, { Schema, Document, Model } from "mongoose";

interface OTP {
  userId: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
}

export interface OTPDocument extends OTP, Document {}

interface OTPModel extends Model<OTPDocument> {
  findValidOTP(
    userId: Schema.Types.ObjectId | string,
    otp: string
  ): Promise<OTPDocument | null>;
}

const otpSchema = new Schema<OTPDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Document will be automatically deleted after 5 minutes
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(+new Date() + 5 * 60 * 1000), // 5 minutes from now
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
otpSchema.index({ userId: 1, otp: 1 });

// Static method to find valid OTP
otpSchema.statics.findValidOTP = function (userId: string, otp: string) {
  return this.findOne({
    userId,
    otp,
    expiresAt: { $gt: new Date() },
    isUsed: false,
  });
};

// Pre-save middleware to ensure OTP is not used
otpSchema.pre("save", function (next) {
  if (this.isUsed) {
    const error = new Error("OTP has already been used");
    return next(error);
  }
  next();
});

const OTPModel = mongoose.model<OTPDocument, OTPModel>("OTP", otpSchema);

export default OTPModel;
