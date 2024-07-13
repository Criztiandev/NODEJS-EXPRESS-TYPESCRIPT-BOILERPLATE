import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

class AccountController {
  constructor() {}

  register = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );

  login = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );

  forgotPassword = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );

  verifyAccount = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );

  changePassword = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );
}

export default new AccountController();
