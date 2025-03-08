import { ObjectId, Schema } from "mongoose";
import config from "../../../config/config";
import EncryptionUtils from "../../../utils/encryption.utils";
import { BadRequestError, UnauthorizedError } from "../../../utils/error.utils";
import tokenUtils from "../../../utils/token.utils";
import { BaseService } from "../../../core/base/service/base.service";
import accountRepository, {
  AccountRepository,
  AccountDocument,
} from "../repository/account.repository";
import OtpService from "../../auth/service/otp.service";
import { OtpTokenPayload } from "../../auth/interface/otp/otp.interface";
export class AccountService extends BaseService<AccountDocument> {
  private readonly accountRepository: AccountRepository;
  private readonly otpService: typeof OtpService;

  constructor(repository: AccountRepository) {
    super(repository);
    this.accountRepository = repository;
    this.otpService = OtpService;
  }

  /**
   * Get user by email with proper error handling
   */
  async getUserByEmail(email: string) {
    const user = await this.accountRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return user;
  }

  /**
   * Get deleted user by email using repository method
   */
  async getDeletedUserByEmail(email: string) {
    const user = await this.accountRepository.findDeletedAccountByEmail(email);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return user;
  }

  /**
   * Get user profile utilizing repository's findById with select
   */
  async getUserProfile(id: string) {
    const user = await this.accountRepository.findById(id, {
      select:
        "-password -refreshToken -isDeleted -deletedAt -role -updatedAt -createdAt -__v",
    });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return user;
  }

  /**
   * Update user with role validation and password hashing
   */
  async updateUser(id: ObjectId, updateData: Partial<AccountDocument>) {
    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    const user = await this.accountRepository.findById(id, {
      select: "_id role",
    });

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

    return await this.accountRepository.updateWithOptions(id, updateData);
  }

  /**
   * Logout user by clearing refresh token
   */
  async logout(userId: Schema.Types.ObjectId | string) {
    if (!userId) {
      throw new BadRequestError("User Id is required");
    }

    const user = await this.accountRepository.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const updatedUser = await this.accountRepository.updateWithOptions(userId, {
      refreshToken: "",
    } as Partial<AccountDocument>);

    return updatedUser._id ?? null;
  }

  /**
   * Reset password with validation and hashing
   */
  async resetPassword(UID: ObjectId, newPassword: string) {
    const user = await this.accountRepository.findById(UID, {
      select: "password",
    });

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const isValidHash = await EncryptionUtils.hashPassword(newPassword);
    if (!isValidHash) {
      throw new BadRequestError("Invalid password format");
    }

    const isSamePassword = await EncryptionUtils.comparePassword(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      throw new BadRequestError(
        "New password must be different from the current password"
      );
    }

    const hashedPassword = await EncryptionUtils.hashPassword(newPassword);
    const updatedUser = await this.accountRepository.updateWithOptions(UID, {
      password: hashedPassword,
    } as Partial<AccountDocument>);

    if (!updatedUser) {
      throw new BadRequestError("Failed to update password");
    }

    return updatedUser;
  }

  /**
   * Restore account with OTP validation
   */
  async restoreAccount(token: string, otp: string) {
    const { payload } = tokenUtils.verifyToken<OtpTokenPayload>(token);

    if (!payload) {
      throw new BadRequestError("Invalid token");
    }

    const user = await this.accountRepository.findDeletedAccountByEmail(
      payload?.email
    );

    if (!user) {
      throw new BadRequestError("Account not found");
    }

    const isDeletedOn7DaysAgo =
      user.deletedAt &&
      new Date(user.deletedAt).getTime() + 7 * 24 * 60 * 60 * 1000 < Date.now();

    if (isDeletedOn7DaysAgo) {
      await this.accountRepository.hardDeleteById(user._id);
      throw new BadRequestError("Account is already deleted");
    }

    const isValidOtp = await this.otpService.verifyOTP(payload.UID, otp);

    if (!isValidOtp) {
      throw new BadRequestError("Invalid OTP");
    }

    const restoredUser = await this.accountRepository.restoreAccount(
      user._id as ObjectId
    );

    if (!restoredUser) {
      throw new BadRequestError("Failed to restore account");
    }

    return restoredUser;
  }

  /**
   * Verify deleted account and generate OTP
   */
  async verfiyDeletedAccount(email: string) {
    const user = await this.accountRepository.findDeletedAccountByEmail(email);
    if (!user) {
      throw new BadRequestError("Account not found");
    }

    const token = tokenUtils.generateToken(
      { email: email, UID: user._id },
      "1h"
    );
    await this.otpService.generateOTP({ email, UID: user._id as ObjectId });

    return {
      link: `${config.BACKEND_URL}/api/account/restore/${token}`,
    };
  }

  /**
   * Verify account and generate reset password token
   */
  async verifyAccount(email: string) {
    const user = await this.accountRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError("Account not found");
    }

    const token = tokenUtils.generateToken(
      { email: email, UID: user._id, isAllowed: true },
      "1h"
    );

    return {
      link: `${config.BACKEND_URL}/account/reset-password/${token}`,
    };
  }
}

// Initialize with repository
export default new AccountService(accountRepository);
