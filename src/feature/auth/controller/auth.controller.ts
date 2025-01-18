import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import authService from "../service/auth.service";
import cookieUtils from "../../../utils/cookie.utils";

class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     description: Register a new user
   *     responses:
   *       201:
   *         description: User registered successfully
   */
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

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login a user
   *     description: Login a user
   *     responses:
   *       200:
   *         description: User logged in successfully
   */
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

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     summary: Forgot password
   *     description: Forgot password
   *     responses:
   *       200:
   *         description: Password changed successfully
   */
  @AsyncHandler()
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    // TODO: Implement forgot password flow
    throw new Error("Not implemented");
  }

  /**
   * @swagger
   * /auth/checkpoint/{id}:
   *   post:
   *     summary: Verify account
   *     description: Verify account
   *     responses:
   *       200:
   *         description: Account verified successfully
   */
  @AsyncHandler()
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    // TODO: Implement account verification flow
    throw new Error("Not implemented");
  }

  /**
   * @swagger
   * /auth/change-password:
   *   post:
   *     summary: Change password
   *     description: Change password
   *     responses:
   *       200:
   *         description: Password changed successfully
   */
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
