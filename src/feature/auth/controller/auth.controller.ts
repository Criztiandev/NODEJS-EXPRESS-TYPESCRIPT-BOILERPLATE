import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import authService from "../service/auth.service";
class AuthController {
  @AsyncHandler()
  async register(req: Request, res: Response, next: NextFunction) {
    const { userId } = await authService.register(req.body);

    res.status(201).json({
      payload: {
        UID: userId,
      },
      message: "Registered Successfully",
    });
  }

  @AsyncHandler()
  async login(req: Request, res: Response, next: NextFunction) {
    /**
     * @swagger
     * tags: ['Auth']
     * summary: Authenticate user and return session tokens
     * description: Endpoint to authenticate users using email and password, returns user role and session tokens
     */

    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);

    // Set session
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
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    const { token, otp } = await authService.forgotPassword(email);

    // otp will be sent to a platform

    res.status(200).json({
      payload: {
        link: `http://localhost:3000/reset-password?checkpoint=${token}&otp=${otp}`,
      },
      message: "Forgot password successful",
    });
  }

  @AsyncHandler()
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    const { checkpoint, otp } = req.body;

    await authService.verifyAccount(checkpoint, otp);

    res.status(200).json({
      message: "Account verified successfully",
    });
  }

  @AsyncHandler()
  async changePassword(req: Request, res: Response, next: NextFunction) {
    const userId = "123123123";
    const { newPassword } = req.body;

    await authService.resetPassword(userId, newPassword);

    res.status(200).json({
      message: "Password changed successfully",
    });
  }
}

export default new AuthController();
