import { NextFunction, Request, Response } from "express";
import { AsyncHandler, ZodValidation } from "../../../utils/decorator.utils";
import authService from "../service/auth.service";
import accountService from "../../account/service/account.service";
import config from "../../../config/config";
import tokenUtils from "../../../utils/token.utils";
import otpService from "../service/otp.service";
import LoginValidation from "../validation/login.validation";
import RegisterValidation from "../validation/register.validation";
import ForgotPasswordValidation from "../validation/forgot-password.validation";
import VerifyEmailValidation from "../validation/verify-email.validation";
import OtpValidation from "../validation/otp.validation";
import { OtpTokenPayload } from "../interface/otp/otp.interface";

class AuthController {
  @AsyncHandler()
  @ZodValidation(RegisterValidation)
  async register(req: Request, res: Response, next: NextFunction) {
    const { UID } = await authService.register(req.body);

    res.status(201).json({
      payload: {
        UID,
      },
      message: "Registered Successfully",
    });
  }

  @AsyncHandler()
  @ZodValidation(LoginValidation)
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);

    req.session.user = user;
    req.session.accessToken = tokens.accessToken;

    res.status(200).json({
      payload: {
        UID: user._id,
        role: user.role,
      },
      message: "Login successful",
    });
  }

  @AsyncHandler()
  @ZodValidation(ForgotPasswordValidation)
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    const { token } = await authService.forgotPassword(email);

    res.status(200).json({
      payload: {
        link: `${config.BACKEND_URL}/auth/checkpoint/account/verify/${token}`,
      },
      message: "Forgot password successful",
    });
  }

  @AsyncHandler()
  @ZodValidation(VerifyEmailValidation)
  async verifyDeletedAccount(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    const { link } = await accountService.verfiyDeletedAccount(email);

    res.status(200).json({
      payload: {
        link,
      },
      message: "Account verified successfully",
    });
  }

  @AsyncHandler()
  @ZodValidation(OtpValidation)
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;
    const { otp } = req.body;

    const { payload } = tokenUtils.verifyToken<OtpTokenPayload>(token);

    await otpService.verifyOTP(payload?.UID ?? null, otp);
    const { link } = await accountService.verifyAccount(payload?.email ?? "");

    res.status(200).json({
      payload: { link },
      message: "Account verified successfully",
    });
  }
}

export default new AuthController();
