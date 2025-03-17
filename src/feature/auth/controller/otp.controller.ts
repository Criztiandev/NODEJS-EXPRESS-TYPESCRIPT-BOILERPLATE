import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import tokenUtils from "../../../utils/token.utils";
import otpService from "../service/otp.service";
import { BadRequestError } from "../../../utils/error.utils";
import { OtpTokenPayload } from "../interface/otp/otp.interface";
// import emailService from "../../email/service/email.service";

class OTPController {
  @AsyncHandler()
  async resendOTP(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;
    const { payload } = tokenUtils.verifyToken<OtpTokenPayload>(token);

    if (!payload) {
      throw new BadRequestError("Invalid token");
    }

    const { otp, userId, _id, isUsed, expiresAt } = await otpService.resendOTP(
      payload.UID,
      payload?.email
    );

    if (!isUsed && expiresAt > new Date()) {
      // await emailService.sendEmail(payload.email as string, otp);
    }

    res.status(200).json({
      payload: {
        userId,
        _id,
      },
      message: "OTP resent successfully",
    });
  }
}

export default new OTPController();
