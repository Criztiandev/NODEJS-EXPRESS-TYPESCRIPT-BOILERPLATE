import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { UserDocument } from "../interface/user.interface";
import userRepository from "../repository/user.repository";

class UserService extends BaseService<UserDocument> {
  constructor(userRepository: BaseRepository<UserDocument>) {
    super(userRepository);
  }
}

export default new UserService(userRepository);
