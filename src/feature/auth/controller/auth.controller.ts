import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import authService from "../service/auth.service";
import accountService from "../../account/service/account.service";
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
        link: `http://localhost:3000/checkpoint/verify?auth=${token}&otp=${otp}`,
      },
      message: "Forgot password successful",
    });
  }

  @AsyncHandler()
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
}

export default new AuthController();
