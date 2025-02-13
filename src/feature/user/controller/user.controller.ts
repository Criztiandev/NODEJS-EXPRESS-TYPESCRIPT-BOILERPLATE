import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../core/base/controller/base.controller";
import { UserDocument } from "../interface/user.interface";
import userService from "../service/user.service";
import { AsyncHandler } from "../../../utils/decorator.utils";

class UserController extends BaseController<UserDocument> {
  protected service: typeof userService;

  constructor() {
    super(userService);
    this.service = userService;
  }

  @AsyncHandler()
  async getAll(req: Request, res: Response, next: NextFunction) {
    const users = await this.service.getPaginatedUsers(req.query);
    res.status(200).json(users);
  }
}

export default new UserController();
