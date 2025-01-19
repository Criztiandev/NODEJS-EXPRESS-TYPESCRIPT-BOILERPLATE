import { User } from "../../../types/models/user";
import { BadRequestError } from "../../../utils/error.utils";
import accountRepository from "../repository/account.repository";
import { FilterQuery, ObjectId } from "mongoose";

class AccountService {
  async getUserById(id: ObjectId | string) {
    return await accountRepository.findById(id);
  }

  async getUserByEmail(email: string) {
    return await accountRepository.findByEmail(email);
  }

  async getUsersByFilter(
    filter: FilterQuery<User>,
    select?: string | Record<string, number>
  ) {
    return await accountRepository.findByFilter(filter, select);
  }

  async createUser(userData: Partial<User>) {
    return await accountRepository.create(userData);
  }

  async updateUser(
    id: ObjectId | string,
    updateData: Partial<User>
  ): Promise<User | null> {
    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    return await accountRepository.update(id, updateData);
  }

  async deleteUser(id: string) {
    return await accountRepository.delete(id);
  }

  async getAllUsers() {
    return await accountRepository.findAll();
  }

  async checkUserExists(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return !!user;
  }

  async getUserProfile(id: string) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    // Remove sensitive data
    return user;
  }

  async logout(userId: ObjectId | string): Promise<ObjectId | string | null> {
    console.log(userId);

    if (!userId) {
      throw new BadRequestError("User Id is required");
    }

    const user = await this.getUserById(userId);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    // update the user refresh token to empty string
    const updatedUser = await this.updateUser(userId, { refreshToken: "" });

    return updatedUser?._id || null;
  }
}

export default new AccountService();
