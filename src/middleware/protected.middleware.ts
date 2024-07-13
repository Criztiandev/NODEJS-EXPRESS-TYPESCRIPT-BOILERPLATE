import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import tokenUtils from "../utils/token.utils";

class ProtectedMiddleware {
  constructor() {}

  protectedRoute = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer"))
        throw new Error("No Token provided, Authorization denied");

      const token = authHeader.split(" ")[1]; // getting the token
      if (!token)
        throw new Error(
          "There is not token is attached, Please try again later"
        );

      // verify token
      const { payload, expired } = tokenUtils.verifyToken(token);
    }
  );
}
