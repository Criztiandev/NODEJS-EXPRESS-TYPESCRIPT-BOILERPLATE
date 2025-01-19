import { NextFunction, Request, Response } from "express";
import accountService from "../service/account.service";
import { AllowedRoles, AsyncHandler } from "../../../utils/decorator.utils";
import { ProtectedController } from "../../../decorator/routes/protected-routes.decorator";

@ProtectedController()
class AccountController {
  /**
   * @swagger
   * /account/profile:
   *   get:
   *     summary: Get the user's profile
   *     description: Retrieve the user's profile information
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
  async details(req: Request, res: Response, next: NextFunction) {
    const userId = "1231231232";
    const userProfile = await accountService.getUserProfile(userId);
    res.status(200).json({
      payload: userProfile,
      message: "User profile retrieved successfully",
    });
  }

  /**
   * @swagger
   * /account/users:
   *   get:
   *     summary: Get all users
   *     description: Retrieve all users
   *     responses:
   *       200:
   *         description: Users retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   */
  @AsyncHandler()
  @AllowedRoles(["admin"])
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const users = await accountService.getAllUsers();
    res.status(200).json({
      payload: users,
      message: "Users retrieved successfully",
    });
  }

  /**
   * @swagger
   * /account/profile:
   *   put:
   *     summary: Update the user's profile
   *     description: Update the user's profile information
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const userId = "1231231231";
    const updatedUser = await accountService.updateUser(userId, req.body);
    res.status(200).json({
      payload: updatedUser,
      message: "Profile updated successfully",
    });
  }

  /**
   * @swagger
   * /account/profile:
   *   delete:
   *     summary: Delete the user's account
   *     description: Delete the user's account
   *     responses:
   *       200:
   *         description: Account deleted successfully
   */
  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    const userId = "12313123";
    req.session.user = "123123123";
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

  /**
   * @swagger
   * /account/logout:
   *   delete:
   *     summary: Logout the user
   *     description: Logout the user
   *     responses:
   *       200:
   *         description: Logged out successfully
   */
  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
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
