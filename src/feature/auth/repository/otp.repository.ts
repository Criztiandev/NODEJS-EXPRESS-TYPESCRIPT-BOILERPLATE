import { Schema } from "mongoose";
import OTPModel, { OTPDocument } from "../../../model/otp.model";

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

  async findOtpByUserId(userId: string) {
    return await OTPModel.findOne({
      userId,
      expiresAt: { $gt: new Date() },
      isUsed: false,
    });
  }

  async findOtpByUIDAndOtp(UID: Schema.Types.ObjectId, otp: string) {
    return await OTPModel.findValidOTP(UID, otp);
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

  async deleteOtp(userId: string) {
    return await OTPModel.deleteMany({ userId });
  }
}

export default new OTPRepository();
