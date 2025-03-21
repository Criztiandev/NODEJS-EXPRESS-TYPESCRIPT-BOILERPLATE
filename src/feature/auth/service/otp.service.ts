import { ObjectId, Schema } from "mongoose";
import { BadRequestError } from "../../../utils/error.utils";
import { generateOTP as generateOTPUtils } from "../../../utils/generate.utilts";
import OtpRepository from "../repository/otp.repository";

class OTPService {
  private readonly otpRepository: typeof OtpRepository;
  private readonly OTP_RATE_LIMIT_MINUTES = 15;

  constructor() {
    this.otpRepository = OtpRepository;
  }

  async generateOTP({ email, UID }: { email: string; UID: ObjectId }) {
    if (!email || !UID) {
      throw new BadRequestError("Email and UID are required");
    }

    const otp = generateOTPUtils();

    const otpRecord = await this.otpRepository.createOtp(UID, otp);

    if (!otpRecord) {
      throw new BadRequestError("Failed to generate OTP");
    }

    return otpRecord;
  }

  async verifyOTP(UID: Schema.Types.ObjectId | null, otp: string) {
    if (!UID) {
      throw new BadRequestError("UID is required");
    }

    const otpRecord = await this.otpRepository.findOTPByUIDAndOTP(UID, otp);

    if (!otpRecord) {
      throw new BadRequestError("Invalid OTP");
    }

    const updatedOtp = await this.otpRepository.updateOtp(UID, otp);

    if (!updatedOtp) {
      throw new BadRequestError("Failed to update OTP");
    }

    return updatedOtp;
  }

  async verifyOTPByEmail(UID: Schema.Types.ObjectId, email: string) {
    const otpRecord = await this.otpRepository.findOtpByUserId(UID);

    if (otpRecord) {
      await this.otpRepository.deleteOtp(UID);
    }

    return await this.generateOTP({ UID, email });
  }

  async resendOTP(UID: Schema.Types.ObjectId, email: string) {
    // check if user has exceeded max OTP attempts in the last 5 minutes
    const otpCount = await this.otpRepository.checkOTPAttempts(UID);

    if (otpCount) {
      throw new BadRequestError("Too many OTP attempts");
    }

    // Try to find existing active OTP
    const existingOtp = await this.otpRepository.findAllOtpByUserId(UID);

    if (existingOtp.length > 0) {
      return existingOtp[0];
    }

    // If no existing OTP found, generate a new one
    return await this.generateOTP({ email, UID });
  }

  async checkOTP(UID: Schema.Types.ObjectId) {
    const otpRecord = await this.otpRepository.findOtpByUserId(UID);
    return !!otpRecord;
  }
}

export default new OTPService();
