import AuthRepository from "../repository/auth.repository";
import EncryptionUtils from "../../../utils/encryption.utils";
import tokenUtils from "../../../utils/token.utils";
import AccountService from "../../account/service/account.service";
import { User } from "../../../types/models/user";
import {
  BadRequestError,
  InputValidationError,
} from "../../../utils/error.utils";
import { LoginDTO } from "../interface/auth/login.interface";
import { RegisterDTO } from "../interface/auth/register.interface";
import { generateOTP } from "../../../utils/generate.utilts";

class AuthService {
  private readonly authRepository: typeof AuthRepository;
  private readonly accountService: typeof AccountService;

  constructor() {
    this.authRepository = AuthRepository;
    this.accountService = AccountService;
  }

  async register(credentials: User): Promise<RegisterDTO> {
    const { email, password, ...userData } = credentials;

    if (Object.keys(credentials).length <= 0) {
      throw new InputValidationError("Please provide all required fields");
    }

    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError("User already exists");
    }

    // Hash password
    const hashedPassword = await EncryptionUtils.hashPassword(password);

    // Create user
    const user = await this.accountService.createUser({
      ...userData,
      email,
      password: hashedPassword,
    });
    if (!user) {
      throw new BadRequestError("Failed to create user");
    }

    return { userId: user._id?.toString() ?? "" };
  }

  async login(email: string, password: string): Promise<LoginDTO> {
    // Find user
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    // Verify password
    const isPasswordValid = await EncryptionUtils.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new InputValidationError("Invalid password");
    }

    if (!user._id) {
      throw new BadRequestError("User ID is required");
    }

    // Generate tokens
    const accessToken = tokenUtils.generateToken({ userId: user._id }, "1h");
    const refreshToken = tokenUtils.generateToken({ userId: user._id }, "7d");

    const updatedCredentials = await this.accountService.updateUser(user._id, {
      refreshToken,
    });

    if (!updatedCredentials) {
      throw new BadRequestError("Failed to update user");
    }

    return {
      user: {
        _id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
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
      throw new BadRequestError("Failed to reset password");
    }
    return true;
  }

  async verifyAccount(checkpoint: string, otp: string) {
    const user = await this.accountService.getUserByEmail(checkpoint);

    if (!user) {
      throw new BadRequestError("User not found");
    }
  }

  async forgotPassword(email: string) {
    const user = await this.accountService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const token = tokenUtils.generateToken({ userId: user._id }, "1h");
    const otp = generateOTP();

    return {
      token,
      otp,
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = tokenUtils.verifyToken(token);
      return decoded;
    } catch (error) {
      throw new BadRequestError("Invalid token");
    }
  }
}

export default new AuthService();
