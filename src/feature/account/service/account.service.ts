import { User } from "../../../types/models/user";
import { BadRequestError } from "../../../utils/error.utils";
import accountRepository from "../repository/account.repository";
import { FilterQuery, ObjectId } from "mongoose";

class AccountService {
  async getUserById(id: string) {
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
    const { password, ...userProfile } = user;
    return userProfile;
  }
}

export default new AccountService();
