import { NextFunction, Request, Response } from "express";

// interface Request extends ExpressRequest {
//   user?: any;
// }

class RequirementsMiddleware {
  constructor() {}

  reqUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new Error("Invalid Session");
  };
}

export default new RequirementsMiddleware();
