import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import tokenUtils from "../utils/token.utils";

class ProtectedMiddleware {
  constructor() {}

  protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    // get the toke to the cookies
    req.sessionStore.get(req.sessionID, (err, sessionData) => {
      try {
        if (err) {
          throw new Error("Error retrieving session data: " + err.message);
        }
        if (!sessionData) {
          throw new Error("No session data found for the given session ID");
        }

        const { accessToken, refreshToken } = sessionData;

        // verify token
        const { payload, expired } = tokenUtils.verifyToken(accessToken);

        if (expired) {
          // generate refresh token
        }

        req.session.user = {
          ...payload,
          role: "user",
          verified: true,
        };

        next();
        // check if user exist, update the payload with credentials that is needed
      } catch (e: any) {
        res.status(400).json({
          error: e.message,
        });
      }
    });
  };
}

export default new ProtectedMiddleware();
