import { UserDocument } from "../interface/user.interface";
import userModel from "../../../model/user.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super(userModel);
  }
}

export default new UserRepository();
