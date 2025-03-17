import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../core/base/controller/base.controller";
import { UserDocument } from "../interface/user.interface";
import userService from "../service/user.service";
import { AsyncHandler, ZodValidation } from "../../../utils/decorator.utils";
import { ProtectedController } from "../../../decorator/routes/protected-routes.decorator";
import { UserValidation } from "../validation/user.validation";

@ProtectedController()
class UserController extends BaseController<UserDocument> {
  protected service: typeof userService;

  constructor() {
    super(userService);
    this.service = userService;
  }

  @AsyncHandler()
  override async getAll(req: Request, res: Response, next: NextFunction) {
    const users = await this.service.getPaginatedUsers(req.query);
    res.status(200).json({
      payload: users,
      message: "Users retrieved successfully",
    });
  }

  @AsyncHandler()
  @ZodValidation(UserValidation)
  override async create(req: Request, res: Response, next: NextFunction) {
    const user = await this.service.createUser(req.body);

    res.status(201).json({
      payload: user,
      message: "User created successfully",
    });
  }

  @AsyncHandler()
  override async getDetails(req: Request, res: Response, next: NextFunction) {
    const user = await this.service.getUserById(req.params.id);
    res.status(200).json({
      payload: user,
      message: "User retrieved successfully",
    });
  }
}

export default new UserController();
