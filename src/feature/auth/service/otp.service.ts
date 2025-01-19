import { BadRequestError } from "../../../utils/error.utils";
import { generateOTP as generateOTPUtils } from "../../../utils/generate.utilts";
import AccountService from "../../account/service/account.service";
import OtpRepository from "../repository/otp.repository";

class OTPService {
  private readonly accountService: typeof AccountService;
  private readonly otpRepository: typeof OtpRepository;

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
    const otpRateLimit = await this.otpRateLimit(email);

    if (otpRateLimit) {
      throw new BadRequestError("OTP rate limit exceeded");
    }

    const otp = generateOTPUtils();

    const createOtp = await this.otpRepository.createOtp(String(user._id), otp);

    return createOtp;
  }

  async verifyOTP(email: string, otp: string) {
    return true;
  }

  async resendOTP(email: string) {
    return true;
  }

  async checkOTP(email: string) {
    return true;
  }

  async otpRateLimit(email: string) {
    return true;
  }
}

export default new OTPService();
