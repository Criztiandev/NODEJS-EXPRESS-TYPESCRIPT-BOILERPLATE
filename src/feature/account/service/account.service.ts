import accountRepository from "../repository/account.repository";
import { UserSchameValue } from "../../../interface/user.interface";
import { FilterQuery } from "mongoose";

class AccountService {
  async getUserById(id: string) {
    return await accountRepository.findById(id);
  }

  async getUserByEmail(email: string) {
    return await accountRepository.findByEmail(email);
  }

  async getUsersByFilter(
    filter: FilterQuery<UserSchameValue>,
    select?: string | Record<string, number>
  ) {
    return await accountRepository.findByFilter(filter, select);
  }

  async createUser(userData: Partial<UserSchameValue>) {
    return await accountRepository.create(userData);
  }

  async updateUser(id: string, updateData: Partial<UserSchameValue>) {
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
