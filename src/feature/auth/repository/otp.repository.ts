import { Schema } from "mongoose";
import OTPModel, { OTPDocument } from "../../../model/otp.model";
import { BadRequestError } from "../../../utils/error.utils";

class OTPRepository {
  async findAllActiveOtp() {
    return await OTPModel.find({
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });
  }

  async findAllOtpByUserId(userId: string) {
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
    const otpRecord = await OTPModel.findOne({
      userId: UID,
      otp,
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });

    if (!otpRecord) {
      throw new BadRequestError("Invalid OTP");
    }

    if (otpRecord.isUsed) {
      throw new BadRequestError("OTP has already been used");
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestError("OTP has expired");
    }

    return otpRecord;
  }

  async createOtp(
    userId: Schema.Types.ObjectId,
    otp: string
  ): Promise<OTPDocument> {
    return await OTPModel.create({
      userId,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
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
