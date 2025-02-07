import { Schema } from "mongoose";
import OTPModel, { OTPDocument } from "../../../model/otp.model";
import { BadRequestError } from "../../../utils/error.utils";

const MAX_OTP_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes

class OTPRepository {
  async findAllActiveOtp() {
    return await OTPModel.find({
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });
  }

  async findAllOtpByUserId(userId: Schema.Types.ObjectId) {
    return await OTPModel.find({
      userId,
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });
  }

  async findOtpByUserId(userId: Schema.Types.ObjectId) {
    return await OTPModel.findOne({
      userId,
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });
  }

  async findOTPByUIDAndOTP(UID: Schema.Types.ObjectId, otp: string) {
    // Check if user has exceeded max OTP attempts in the last 5 minutes
    const recentOTPCount = await this.checkOTPAttempts(UID);

    if (recentOTPCount) {
      throw new BadRequestError("Too many OTP attempts");
    }

    // Find the current OTP record
    const otpRecord = await OTPModel.findOne({
      userId: UID,
      otp,
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });

    if (!otpRecord) {
      throw new BadRequestError("Invalid OTP");
    }

    // Delete any old OTPs for this user (except the current one)
    await OTPModel.deleteMany({
      userId: UID,
      _id: { $ne: otpRecord._id },
      isUsed: false,
    });

    // Verify OTP hasn't been used
    if (otpRecord.isUsed) {
      throw new BadRequestError("OTP has already been used");
    }

    // Verify OTP hasn't expired
    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestError("OTP has expired");
    }

    return otpRecord;
  }

  async markOTPAsUsed(UID: Schema.Types.ObjectId, otp: string): Promise<void> {
    await OTPModel.findOneAndUpdate(
      { userId: UID, otp },
      { $set: { isUsed: true } }
    );
  }

  async checkOTPAttempts(UID: Schema.Types.ObjectId) {
    const recentOTPCount = await OTPModel.countDocuments({
      userId: UID,
      createdAt: {
        $gte: new Date(Date.now() - LOCKOUT_DURATION_MS),
      },
    });

    return recentOTPCount >= MAX_OTP_ATTEMPTS;
  }

  async createOtp(
    userId: Schema.Types.ObjectId,
    otp: string
  ): Promise<OTPDocument> {
    const recentOTPCount = await OTPModel.countDocuments({
      userId,
      createdAt: {
        $gte: new Date(Date.now() - LOCKOUT_DURATION_MS),
      },
    });

    if (recentOTPCount >= MAX_OTP_ATTEMPTS) {
      throw new BadRequestError(
        `Too many OTP attempts. Please wait ${Math.ceil(
          LOCKOUT_DURATION_MS / 60000
        )} minutes before trying again.`
      );
    }

    return await OTPModel.create({
      userId,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + OTP_EXPIRATION_MS), // 5 minutes expiry
      isUsed: false,
    });
  }

  async updateOtp(userId: Schema.Types.ObjectId | string, otp: string) {
    return await OTPModel.findOneAndUpdate(
      { userId, otp },
      { isUsed: true },
      { new: true }
    );
  }

  async deleteOtp(userId: Schema.Types.ObjectId) {
    const result = await OTPModel.deleteMany({ userId });
    if (result.deletedCount === 0) {
      throw new BadRequestError("OTP not deleted");
    }
    return result;
  }
}

export default new OTPRepository();
