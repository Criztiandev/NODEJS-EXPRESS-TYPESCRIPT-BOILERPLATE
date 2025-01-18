import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { UserSchameValue } from "../../../interface/user.interface";
import userModel from "../../../model/user.model";
import EncryptionUtils from "../../../utils/encryption.utils";
import tokenUtils from "../../../utils/token.utils";

class AccountController {
  constructor() {}

  register = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req;
      const { email, password } = body as UserSchameValue;
      // check if user exist
      const userExist = await userModel.findOne({ email }).lean().select("_id");
      if (userExist) throw new Error("User already exist");

      const hashedPassword = await EncryptionUtils.hashPassword(password);

      //
      const credentials = await userModel.create({
        ...body,
        password: hashedPassword,
      });

      if (!credentials)
        throw new Error("Something went wrong, Please try again later");

      res.status(200).json({
        payload: {
          UID: credentials?._id,
        },
        message: "Registered Successfully",
      });
    }
  );

  login = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      // check if user exist
      const userExist = await userModel
        .findOne({ email })
        .lean()
        .select("_id password");
      if (!userExist) throw new Error("User doesn't exist");

      const isPasswordCorrect = await EncryptionUtils.comparePassword(
        password,
        userExist.password
      );

      if (!isPasswordCorrect)
        throw new Error("Incorrect Password, Please try again later");

      const payload = { UID: userExist._id };

      const accessToken = tokenUtils.generateToken<any>(payload, "5s");
      const refreshToken = tokenUtils.generateToken<any>(payload, "1yr");

      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;

      res.status(200).json({
        payload: {
          UID: userExist._id,
        },
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
