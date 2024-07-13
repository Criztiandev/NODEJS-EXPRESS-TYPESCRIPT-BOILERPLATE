import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

class SessionController {
  constructor() {}

  refereshAccessToken = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );
}

export default new SessionController();
