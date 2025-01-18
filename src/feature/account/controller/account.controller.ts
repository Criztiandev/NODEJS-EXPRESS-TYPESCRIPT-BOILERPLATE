import { NextFunction, Request, Response } from "express";
import accountService from "../service/account.service";
import { AllowedRoles, AsyncHandler } from "../../../utils/decorator.utils";

class AccountController {
  @AllowedRoles(["user", "admin"])
  @AsyncHandler()
  async details(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.user?._id;
    const userProfile = await accountService.getUserProfile(userId);
    res.status(200).json({
      payload: userProfile,
      message: "User profile retrieved successfully",
    });
  }

  @AllowedRoles(["admin"])
  @AsyncHandler()
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const users = await accountService.getAllUsers();
    res.status(200).json({
      payload: users,
      message: "Users retrieved successfully",
    });
  }

  @AllowedRoles(["user", "admin"])
  @AsyncHandler()
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.user?._id;
    const updatedUser = await accountService.updateUser(userId, req.body);
    res.status(200).json({
      payload: updatedUser,
      message: "Profile updated successfully",
    });
  }

  @AllowedRoles(["user", "admin"])
  @AsyncHandler()
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.user?._id;
    await accountService.deleteUser(userId);
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({
          message: "Error deleting account",
        });
        return;
      }
      res.clearCookie("connect.sid");
      res.status(200).json({
        message: "Account deleted successfully",
      });
    });
  }

  @AllowedRoles(["user", "admin"])
  @AsyncHandler()
  async logout(req: Request, res: Response, next: NextFunction) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({
          message: "Error logging out",
        });
        return;
      }
      res.clearCookie("connect.sid");
      res.status(200).json({
        message: "Logged out successfully",
      });
    });
  }
}

export default new AccountController();
