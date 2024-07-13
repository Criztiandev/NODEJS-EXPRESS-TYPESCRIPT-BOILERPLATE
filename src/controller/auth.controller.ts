import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import tokenUtils from "../utils/token.utils";

class AccountController {
  constructor() {}

  register = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;

      res.status(200).json({
        message: "Registered Successfully",
      });
    }
  );

  login = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      const payload = { id: "#1223", email };

      // generate here the sessoion
      const currentSession = 0;

      const accessToken = tokenUtils.generateToken<any>(payload, "5s");
      const refreshToken = tokenUtils.generateToken<any>(payload, "1yr");

      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;

      res.status(200).json({
        payload,
        message: "Login successfully",
      });
    }
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
