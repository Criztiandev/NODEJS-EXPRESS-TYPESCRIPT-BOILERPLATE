import { ObjectId, Schema } from "mongoose";
import { BadRequestError } from "../../../utils/error.utils";
import { generateOTP as generateOTPUtils } from "../../../utils/generate.utilts";
import AccountService from "../../account/service/account.service";
import OtpRepository from "../repository/otp.repository";

class OTPService {
  private readonly accountService: typeof AccountService;
  private readonly otpRepository: typeof OtpRepository;
  private readonly OTP_RATE_LIMIT_MINUTES = 15;

  constructor() {
    this.accountService = AccountService;
    this.otpRepository = OtpRepository;
  }

  async generateOTP({ email, UID }: { email: string; UID: ObjectId }) {
    if (!email) {
      throw new BadRequestError("Email is required");
    }

    // Add Rate Limit

    const otp = generateOTPUtils();

    const otpRecord = await this.otpRepository.createOtp(UID, otp);

    return otpRecord;
  }

  async verifyOTP(UID: Schema.Types.ObjectId, otp: string) {
    const otpRecord = await this.otpRepository.findOTPByUIDAndOTP(UID, otp);
    await this.otpRepository.updateOtp(UID, otp);

    return otpRecord;
  }

  async verifyOTPByEmail(UID: Schema.Types.ObjectId, email: string) {
    const otpRecord = await this.otpRepository.findOtpByUserId(UID);

    if (otpRecord) {
      await this.otpRepository.deleteOtp(UID);
    }

    return await this.generateOTP({ UID, email });
  }

  async resendOTP(UID: Schema.Types.ObjectId, email: string) {
    await this.otpRepository.deleteOtp(UID);
    return this.generateOTP({ UID, email });
  }

  async checkOTP(email: string) {
    const user = await this.accountService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const otpRecord = await this.otpRepository.findOtpByUserId(
      user._id as Schema.Types.ObjectId
    );
    return !!otpRecord;
  }
}

export default new OTPService();
