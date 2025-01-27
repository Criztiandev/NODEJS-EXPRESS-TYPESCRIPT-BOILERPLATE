import { Schema } from "mongoose";
import { BadRequestError } from "../../../utils/error.utils";
import { generateOTP as generateOTPUtils } from "../../../utils/generate.utilts";
import AccountService from "../../account/service/account.service";
import OtpRepository from "../repository/otp.repository";

class OTPService {
  private readonly accountService: typeof AccountService;
  private readonly otpRepository: typeof OtpRepository;
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly MAX_OTP_ATTEMPTS = 3;
  private readonly OTP_RATE_LIMIT_MINUTES = 15;

  constructor() {
    this.accountService = AccountService;
    this.otpRepository = OtpRepository;
  }

  async generateOTP(email: string) {
    // check if user exist
    const user = await this.accountService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    // check if otp rate limit
    const isRateLimited = await this.otpRateLimit(email);

    if (isRateLimited) {
      throw new BadRequestError(
        `Please wait ${this.OTP_RATE_LIMIT_MINUTES} minutes before requesting another OTP`
      );
    }

    const otp = generateOTPUtils();

    const otpRecord = await this.otpRepository.createOtp(
      user._id as Schema.Types.ObjectId,
      otp
    );

    return otpRecord;
  }

  async verifyOTP(UID: Schema.Types.ObjectId, otp: string) {
    const otpRecord = await this.otpRepository.findOtpByUIDAndOtp(UID, otp);

    if (!otpRecord) {
      throw new BadRequestError("Invalid OTP");
    }

    if (otpRecord.isUsed) {
      throw new BadRequestError("OTP has already been used");
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestError("OTP has expired");
    }

    await this.otpRepository.updateOtp(UID, otp);

    return true;
  }

  async resendOTP(email: string) {
    const user = await this.accountService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    await this.otpRepository.deleteOtp(String(user._id));
    return this.generateOTP(email);
  }

  async checkOTP(email: string) {
    const user = await this.accountService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const otpRecord = await this.otpRepository.findOtpByUserId(
      String(user._id)
    );
    return !!otpRecord;
  }

  async otpRateLimit(email: string) {
    const user = await this.accountService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const otpAttempts = await this.otpRepository.findAllOtpByUserId(
      String(user._id)
    );

    if (!otpAttempts) {
      return false;
    }

    return true;
  }
}

export default new OTPService();
