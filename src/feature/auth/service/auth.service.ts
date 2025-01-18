import AuthRepository from "../repository/auth.repository";
import EncryptionUtils from "../../../utils/encryption.utils";
import tokenUtils from "../../../utils/token.utils";
import AccountService from "../../account/service/account.service";
import { User } from "../../../types/models/user";

class AuthService {
  private readonly authRepository: typeof AuthRepository;
  private readonly accountService: typeof AccountService;

  constructor() {
    this.authRepository = AuthRepository;
    this.accountService = AccountService;
  }

  async register(userData: Partial<User>) {
    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(
      userData.email!
    );
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await EncryptionUtils.hashPassword(
      userData.password!
    );
    userData.password = hashedPassword;
    userData.role = "user"; // Default role

    // Create user
    const user = await this.accountService.createUser(userData);
    if (!user) {
      throw new Error("Failed to create user");
    }

    return { userId: user._id };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify password
    const isPasswordValid = await EncryptionUtils.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate tokens
    const accessToken = tokenUtils.generateToken({ userId: user._id }, "1h");
    const refreshToken = tokenUtils.generateToken({ userId: user._id }, "7d");

    return {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async resetPassword(userId: string, newPassword: string) {
    const hashedPassword = await EncryptionUtils.hashPassword(newPassword);
    const updated = await this.authRepository.updatePassword(
      userId,
      hashedPassword
    );
    if (!updated) {
      throw new Error("Failed to reset password");
    }
    return true;
  }

  async validateToken(token: string) {
    try {
      const decoded = tokenUtils.verifyToken(token);
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

export default new AuthService();
