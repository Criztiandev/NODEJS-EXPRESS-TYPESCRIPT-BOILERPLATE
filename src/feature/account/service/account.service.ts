import { UserDocument } from "../../../model/user.model";
import { User } from "../../../types/models/user";
import EncryptionUtils from "../../../utils/encryption.utils";
import { BadRequestError, UnauthorizedError } from "../../../utils/error.utils";
import accountRepository from "../repository/account.repository";
import { FilterQuery, ObjectId } from "mongoose";

class AccountService {
  /**
   * Get user by ID
   * @param id - User ID
   * @param select - Select fields
   * @returns User
   */
  async getUserById(
    id: ObjectId | string,
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
    return await accountRepository.findByEmail(email);
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
    id: ObjectId | string,
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
   * Delete user
   * @param id - User ID
   * @returns User ID
   */
  async deleteUser(id: ObjectId | string) {
    // check if user is admin
    const user = await this.getUserById(id, "_id role");

    if (!user) {
      throw new BadRequestError("User not found");
    }

    return await accountRepository.delete(id);
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
  async logout(userId: ObjectId | string): Promise<ObjectId | string | null> {
    if (!userId) {
      throw new BadRequestError("User Id is required");
    }

    const user = await this.getUserById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const updatedUser = await this.updateUser(userId, { refreshToken: "" });
    return updatedUser?._id?.toString() ?? null;
  }
}

export default new AccountService();
