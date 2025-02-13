import { BaseController } from "../../../core/base/controller/base.controller";
import { UserDocument } from "../interface/user.interface";
import userService from "../service/user.service";

class UserController extends BaseController<UserDocument> {
  constructor() {
    super(userService);
  }
}

export default new UserController();
