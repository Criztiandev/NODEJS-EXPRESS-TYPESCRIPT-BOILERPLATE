import { Model } from "mongoose";
import { UserSchameValue } from "../../../interface/user.interface";
import userModel from "../../../model/user.model";

class AuthRepository {
  private readonly userModel: Model<UserSchameValue>;

  constructor(userModel: Model<UserSchameValue>) {
    this.userModel = userModel;
  }

  // Find user credentials for authentication
  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean();
  }

  // Update password hash
  async updatePassword(userId: string, passwordHash: string) {
    return await this.userModel
      .findByIdAndUpdate(userId, { password: passwordHash })
      .lean();
  }
}

export default new AuthRepository(userModel);
