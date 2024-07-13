import { NextFunction, Request, Response } from "express";

class RequirementsMiddleware {
  constructor() {}

  reqUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("Invalid Session");
  };
}

export default new RequirementsMiddleware();
