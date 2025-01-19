import { Model } from "mongoose";
import userModel from "../../../model/user.model";
import { User } from "../../../types/models/user";

class AuthRepository {
  private readonly userModel: Model<User>;

  constructor(userModel: Model<User>) {
    this.userModel = userModel;
  }

  // Find user credentials for authentication
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  // Update password hash
  async updatePassword(userId: string, passwordHash: string) {
    return await this.userModel.findByIdAndUpdate(userId, {
      password: passwordHash,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.userModel.findByIdAndUpdate(userId, {
      refreshToken,
    });
  }
}

export default new AuthRepository(userModel);
