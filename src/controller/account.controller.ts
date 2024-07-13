import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
class AccountController {
  constructor() {}

  details = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );

  logout = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );
}

export default new AccountController();
