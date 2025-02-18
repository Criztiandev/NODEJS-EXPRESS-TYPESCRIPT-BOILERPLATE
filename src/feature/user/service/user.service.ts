import { ObjectId } from "mongoose";
import {
  BaseRepository,
  PaginatedResponse,
} from "../../../core/base/repository/base.repository";
import {
  BaseService,
  QueryParams,
} from "../../../core/base/service/base.service";
import EncryptionUtils from "../../../utils/encryption.utils";
import { BadRequestError } from "../../../utils/error.utils";
import { UserDocument } from "../interface/user.interface";
import userRepository from "../repository/user.repository";
import barangayService from "../../barangay/service/barangay.service";
import { UserInput } from "../validation/user.validation";

class UserService extends BaseService<UserDocument> {
  constructor(userRepository: BaseRepository<UserDocument>) {
    super(userRepository);
  }

  public getPaginatedUsers(
    queryParams: QueryParams
  ): Promise<PaginatedResponse<UserDocument>> {
    const selectedFields = [
      "-password",
      "-refreshToken",
      "-role",
      "-isDeleted",
      "-deletedAt",
    ];
    return super.getPaginatedItems(queryParams, {
      select: selectedFields.join(" "),
      searchableFields: ["firstName", "lastName", "email"],
      defaultFilters: { isDeleted: false },
    });
  }

  public async createUser(user: UserDocument): Promise<{ _id: ObjectId }> {
    const hashedPassword = await EncryptionUtils.hashPassword(user.password);
    user.password = hashedPassword;

    const barangay = await barangayService.getItem(user.fullAddress.barangay);

    if (!barangay) {
      throw new BadRequestError("Barangay does not exist");
    }

    const createdUser = await super.createItem(user);
    if (!createdUser) {
      throw new BadRequestError("Failed to create user");
    }

    return {
      _id: createdUser._id as ObjectId,
    };
  }

  public getUserById(id: string): Promise<UserDocument | null> {
    return super.getItem(id, "-password");
  }
}

export default new UserService(userRepository);
