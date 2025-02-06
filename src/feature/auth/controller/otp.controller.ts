import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import otpService from "../service/otp.service";
import { BadRequestError } from "../../../utils/error.utils";
import accountService from "../../account/service/account.service";
import { Schema } from "mongoose";

class OTPController {
  @AsyncHandler()
  async generateOTP(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    const user = await accountService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const otp = await otpService.generateOTP(
      user._id as Schema.Types.ObjectId,
      email
    );

    if (!otp) {
      throw new BadRequestError("OTP not generated");
    }

    res.status(200).json({
      payload: {},
      message: "OTP generated successfully",
    });
  }

  @AsyncHandler()
  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    const user = await accountService.getDeletedUserByEmail(email);

    const otpRecord = await otpService.verifyOTPByEmail(
      user._id as Schema.Types.ObjectId,
      email
    );

    if (!otpRecord) {
      throw new BadRequestError("Something went wrong");
    }

    res.status(200).json({
      payload: otpRecord,
      message: "OTP verified successfully",
    });
  }

  @AsyncHandler()
  async resendOTP(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      message: "OTP resent successfully",
    });
  }

  @AsyncHandler()
  async checkOTP(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      message: "OTP checked successfully",
    });
  }
}

export default new OTPController();
