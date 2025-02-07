import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import tokenUtils from "../../../utils/token.utils";
import otpService from "../service/otp.service";
import { ObjectId } from "mongoose";
import emailService from "../../email/service/email.service";

class OTPController {
  @AsyncHandler()
  async resendOTP(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;
    const { payload } = tokenUtils.verifyToken(token);

    const { otp, userId, _id, isUsed, expiresAt } = await otpService.resendOTP(
      payload.UID as ObjectId,
      payload.email as string
    );

    if (!isUsed && expiresAt > new Date()) {
      await emailService.sendEmail(payload.email as string, otp);
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
