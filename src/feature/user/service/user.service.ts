import { ObjectId } from "mongoose";
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import EncryptionUtils from "../../../utils/encryption.utils";
import { BadRequestError } from "../../../utils/error.utils";
import { UserDocument } from "../interface/user.interface";
import userRepository from "../repository/user.repository";
import barangayService from "../../barangay/service/barangay.service";
import {
  PaginatedResponse,
  PaginationQueryParams,
} from "../../../core/base/types/query.types";

class UserService extends BaseService<UserDocument> {
  constructor(userRepository: BaseRepository<UserDocument>) {
    super(userRepository);
  }

  public getPaginatedUsers(
    queryParams: PaginationQueryParams
  ): Promise<PaginatedResponse<UserDocument>> {
    const selectedFields = [
      "-password",
      "-refreshToken",
      "-role",
      "-isDeleted",
      "-deletedAt",
    ];
    return super.getPaginatedService(queryParams, {
      select: selectedFields.join(" "),
      searchableFields: ["firstName", "lastName", "email"],
      defaultFilters: { isDeleted: false },
    });
  }

  public async createUser(user: UserDocument): Promise<{ _id: ObjectId }> {
    const hashedPassword = await EncryptionUtils.hashPassword(user.password);
    user.password = hashedPassword;

    await barangayService.validateMultipleItems(
      { _id: user.fullAddress.barangay },
      { errorMessage: "Barangay does not exist" }
    );

    const createdUser = await super.createService(user);
    if (!createdUser) {
      throw new BadRequestError("Failed to create user");
    }

    return {
      _id: createdUser._id as ObjectId,
    };
  }

  public getUserById(id: string): Promise<UserDocument | null> {
    return super.getByIdService(id, {
      select: "-password",
    });
  }
}

export default new UserService(userRepository);
