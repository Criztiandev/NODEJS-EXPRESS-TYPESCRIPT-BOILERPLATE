import { UserDocument } from "../../../model/user.model";
import { User } from "../../../types/models/user";
import EncryptionUtils from "../../../utils/encryption.utils";
import { BadRequestError, UnauthorizedError } from "../../../utils/error.utils";
import tokenUtils from "../../../utils/token.utils";
import otpService from "../../auth/service/otp.service";
import accountRepository from "../repository/account.repository";
import { FilterQuery, ObjectId, Schema } from "mongoose";

class AccountService {
  /**
   * Get user by ID
   * @param id - User ID
   * @param select - Select fields
   * @returns User
   */
  async getUserById(
    id: Schema.Types.ObjectId | string,
    select: string = "-password -refreshToken"
  ) {
    return await accountRepository.findById(id, select);
  }

  /**
   * Get user by email
   * @param email - User email
   * @returns User
   */
  async getUserByEmail(email: string) {
    const user = await accountRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return user;
  }

  async getDeletedUserByEmail(email: string) {
    const user = await accountRepository.findDeletedAccountByEmail(email);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return user;
  }

  /**
   * Get users by filter
   * @param filter - Filter query
   * @param select - Select fields
   * @returns Users
   */
  async getUsersByFilter(
    filter: FilterQuery<User>,
    select?: string | Record<string, number>
  ) {
    return await accountRepository.findByFilter(filter);
  }

  /**
   * Create user
   * @param userData - User data to create
   * @returns User
   */
  async createUser(userData: Partial<User>) {
    return await accountRepository.create(userData);
  }

  /**
   * Update user
   * @param id - User ID
   * @param updateData - User data to update
   * @returns User
   */
  async updateUser(
    id: Schema.Types.ObjectId,
    updateData: Partial<User>
  ): Promise<UserDocument | null> {
    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    const user = await this.getUserById(id, "_id role");

    if (!user) {
      throw new BadRequestError("User not found");
    }

    if (updateData.role && user.role !== "admin") {
      throw new UnauthorizedError("You are not authorized to update role");
    }

    if (updateData.password) {
      updateData.password = await EncryptionUtils.hashPassword(
        updateData.password
      );
    }

    return await accountRepository.update(id, updateData);
  }

  /**
   * Get all users
   * @returns All users
   */
  async getAllUsers() {
    return await accountRepository.findAll();
  }

  /**
   * Check if user exists
   * @param email - User email
   * @returns boolean
   */
  async checkUserExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return !!user;
  }

  /**
   * Get user profile
   * @param id - User ID
   * @returns User profile
   */
  async getUserProfile(id: string) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    // Remove sensitive data
    return user;
  }

  /**
   * Logout user and remove refresh token
   * @param userId - User ID
   * @returns User ID
   */
  async logout(
    userId: Schema.Types.ObjectId | string
  ): Promise<Schema.Types.ObjectId | string | null> {
    if (!userId) {
      throw new BadRequestError("User Id is required");
    }

    const user = await this.getUserById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const updatedUser = await this.updateUser(
      user._id as Schema.Types.ObjectId,
      {
        refreshToken: "",
      }
    );
    return updatedUser?._id?.toString() ?? null;
  }

  /**
   * Delete user
   * @param id - User ID
   * @returns User ID
   */
  async softDeleteAccount(id: Schema.Types.ObjectId | string) {
    // check if user is admin
    const user = await this.getUserById(id, "_id role");

    if (!user) {
      throw new BadRequestError("User not found");
    }

    return await accountRepository.softDelete(id);
  }
  /**
   * Delete user
   * @param id - User ID
   * @returns User ID
   */
  async hardDeleteAccount(id: string) {
    return await accountRepository.hardDelete(id);
  }

  async restoreAccount(token: string, otp: string) {
    const { payload } = tokenUtils.verifyToken(token);

    // check if the account is already restored
    const user = await accountRepository.findDeletedAccountByEmail(
      payload.email
    );

    if (!user) {
      throw new BadRequestError("Account not found");
    }

    // check if the account is deleted on 7 days ago
    const isDeletedOn7DaysAgo =
      user.deletedAt &&
      new Date(user.deletedAt).getTime() + 7 * 24 * 60 * 60 * 1000 < Date.now();

    if (isDeletedOn7DaysAgo) {
      await this.hardDeleteAccount(String(user._id));
      throw new BadRequestError("Account is already deleted");
    }

    // check if the otp is correct
    const isValidOtp = await otpService.verifyOTP(payload.UID, otp);

    if (!isValidOtp) {
      throw new BadRequestError("Invalid OTP");
    }

    const restoredUser = await accountRepository.restoreAccount(
      user._id as ObjectId
    );

    if (!restoredUser) {
      throw new BadRequestError("Failed to restore account");
    }

    return restoredUser;
  }

  async verfiyDeletedAccount(email: string) {
    const user = await accountRepository.findDeletedAccountByEmail(email);
    if (!user) {
      throw new BadRequestError("Account not found");
    }

    const token = tokenUtils.generateToken(
      { email: email, UID: user._id },
      "1h"
    );
    await otpService.generateOTP({ email, UID: user._id as ObjectId });

    return {
      link: `http://localhost:8000/api/account/restore/${token}`,
    };
  }
}

export default new AccountService();
