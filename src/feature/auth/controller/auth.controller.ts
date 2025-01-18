import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import authService from "../service/auth.service";
import cookieUtils from "../../../utils/cookie.utils";

class AuthController {
  @AsyncHandler()
  async register(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    const { userId } = await authService.register(body);

    res.status(201).json({
      payload: {
        UID: userId,
      },
      message: "Registered Successfully",
    });
  }

  @AsyncHandler()
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const { user, tokens } = await authService.login(email, password);

    // Set session
    req.session.user = user;

    // Set auth cookie
    cookieUtils.setAuthCookie(res, tokens.accessToken);

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
    // TODO: Implement forgot password flow
    throw new Error("Not implemented");
  }

  @AsyncHandler()
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    // TODO: Implement account verification flow
    throw new Error("Not implemented");
  }

  @AsyncHandler()
  async changePassword(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.user?._id;
    const { newPassword } = req.body;

    await authService.resetPassword(userId, newPassword);

    res.status(200).json({
      message: "Password changed successfully",
    });
  }
}

export default new AuthController();
