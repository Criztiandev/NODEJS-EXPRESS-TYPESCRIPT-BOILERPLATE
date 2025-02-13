import { User } from "../../user/interface/user.interface";
import userModel from "../../../model/user.model";

class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return await userModel.findOne({ email });
  }

  // Update password hash
  async updatePassword(userId: string, passwordHash: string) {
    return await userModel.findByIdAndUpdate(userId, {
      password: passwordHash,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return await userModel.findByIdAndUpdate(userId, {
      refreshToken,
    });
  }
}

export default new AuthRepository();
