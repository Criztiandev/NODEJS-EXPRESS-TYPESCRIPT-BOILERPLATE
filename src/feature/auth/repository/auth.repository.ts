import { Model } from "mongoose";
import userModel, { UserDocument } from "../../../model/user.model";
import { User } from "../../../types/models/user";

class AuthRepository {
  private readonly userModel: Model<UserDocument>;

  constructor(userModel: Model<UserDocument>) {
    this.userModel = userModel;
  }

  // Find user credentials for authentication
  async findUserByEmail(email: string): Promise<User | null> {
    return await userModel.findOne({ email });
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
