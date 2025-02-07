import { NextFunction, Request, Response } from "express";
import accountService from "../service/account.service";
import {
  AllowedRoles,
  AsyncHandler,
  ZodValidation,
} from "../../../utils/decorator.utils";
import {
  ProtectedController,
  PublicRoute,
} from "../../../decorator/routes/protected-routes.decorator";
import { BadRequestError } from "../../../utils/error.utils";
import tokenUtils from "../../../utils/token.utils";
import { ObjectId } from "mongoose";
import UpdateAccountValidation from "../validation/update-profile.validation";
import OtpValidation from "../../auth/validation/otp.validation";
import ResetPasswordValidation from "../validation/reset-password.validation";

@ProtectedController()
class AccountController {
  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
  async profile(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.user;
    const userProfile = await accountService.getUserProfile(userId);

    res.status(200).json({
      payload: userProfile,
      message: "User profile retrieved successfully",
    });
  }

  @AsyncHandler()
  @AllowedRoles(["admin"])
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const users = await accountService.getAllUsers();
    res.status(200).json({
      payload: users,
      message: "Users retrieved successfully",
    });
  }

  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
  @ZodValidation(UpdateAccountValidation)
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.user._id;
    const updatedUser = await accountService.updateUser(userId, req.body);

    res.status(200).json({
      payload: updatedUser,
      message: "Profile updated successfully",
    });
  }

  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
  async logout(req: Request, res: Response, next: NextFunction) {
    const userId = await accountService.logout(req.session.user._id);

    if (!userId) {
      throw new BadRequestError("Failed to logout");
    }

    req.session.destroy((err) => {
      if (err) {
        throw new BadRequestError("Failed to logout");
      }
      res.clearCookie("connect.sid");
      res.status(200).json({
        message: "Logged out successfully",
      });
    });
  }

  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
  async softDeleteAccount(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.user._id;

    await accountService.softDeleteAccount(userId);

    req.session.destroy((err) => {
      if (err) {
        throw new BadRequestError("Failed to delete account");
      }

      res.clearCookie("connect.sid");

      res.status(200).json({
        message: "Account deleted successfully",
      });
    });
  }

  @AsyncHandler()
  @PublicRoute()
  @ZodValidation(OtpValidation)
  async restoreAccount(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;
    const { otp } = req.body;

    await accountService.restoreAccount(token, otp);

    res.status(200).json({
      message: "Account restored successfully",
    });
  }

  @AsyncHandler()
  @PublicRoute()
  @ZodValidation(ResetPasswordValidation)
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;
    const { password } = req.body;

    const { payload } = tokenUtils.verifyToken(token);

    const result = await accountService.resetPassword(
      payload.UID as ObjectId,
      password
    );

    res.status(200).json({
      payload: result,
      message: "Account restored successfully",
    });
  }
}

export default new AccountController();
