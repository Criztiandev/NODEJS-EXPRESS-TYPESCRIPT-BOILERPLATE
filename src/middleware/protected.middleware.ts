import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import tokenUtils from "../utils/token.utils";

class ProtectedMiddleware {
  constructor() {}

  extractSessionData = (req: Request, res: Response): Promise<any> => {
    return new Promise((resolve, reject) => {
      req.sessionStore.get(req.sessionID, (err, data) => {
        if (err) {
          res.status(400);
          reject(new Error("Error retrieving session data: " + err.message));
        } else if (!data) {
          res.status(400);
          reject(new Error("No session data found for the given session ID"));
        } else {
          resolve(data);
        }
      });
    });
  };

  protectedRoute = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const sessionData = await this.extractSessionData(req, res);

      if (!sessionData)
        throw new Error("Invalid action, No session data found");

      const { accessToken, refreshToken } = sessionData;

      // verfiy access
      const { payload, expired } = tokenUtils.verifyToken(accessToken);

      if (expired) {
        // verify refresh token
        const { payload, expired } = tokenUtils.verifyToken(refreshToken);
        if (expired) throw new Error("Refresh token expired");

        // generate new access token
        const newAccessToken = tokenUtils.generateToken<any>(payload, "10s");
        req.session.accessToken = newAccessToken;

        // attach the payload to the session
        req.session.user = { ...payload, role: "user", verified: true };

        next();
      } else {
        // attach the payload to the session
        req.session.user = { ...payload, role: "user", verified: true };
        next();
      }
    }
  );
}

export default new ProtectedMiddleware();
