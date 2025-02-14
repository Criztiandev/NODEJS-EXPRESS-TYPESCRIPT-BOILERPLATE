import {
  BaseRepository,
  PaginatedResponse,
} from "../../../core/base/repository/base.repository";
import {
  BaseService,
  QueryParams,
} from "../../../core/base/service/base.service";
import { UserDocument } from "../interface/user.interface";
import userRepository from "../repository/user.repository";

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
    const select = selectedFields.join(" ");
    return super.getPaginatedItems(queryParams, selectedFields, {
      select,
    });
  }

  public getUserById(id: string): Promise<UserDocument | null> {
    return super.getItem(id, "-password");
  }
}

export default new UserService(userRepository);
