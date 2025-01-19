import { NextFunction, Request, Response } from "express";
import accountService from "../service/account.service";
import { AllowedRoles, AsyncHandler } from "../../../utils/decorator.utils";
import {
  ProtectedController,
  PublicRoute,
} from "../../../decorator/routes/protected-routes.decorator";
import { BadRequestError } from "../../../utils/error.utils";

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
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    // Add a zod validation

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
  async restoreAccount(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    await accountService.restoreAccount(email);

    res.status(200).json({
      message: "Account restored successfully",
    });
  }
}

export default new AccountController();
