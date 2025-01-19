import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../../utils/decorator.utils";

class OTPController {
  @AsyncHandler()
  async generateOTP(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      message: "OTP generated successfully",
    });
  }

  @AsyncHandler()
  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
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
