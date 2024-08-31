import { NextFunction, Request, Response } from "express"; // Import Response
import tokenUtils from "../utils/token.utils";
import expressAsyncHandler from "express-async-handler";

/**
 * Extract the session from the request body
 * @param req
 * @returns
 */
const extractSessionData = (req: Request): Promise<any> => {
  return new Promise((resolve, reject) => {
    req.sessionStore.get(req.sessionID, (err, data) => {
      if (err) {
        reject(new Error("Error retrieving session data: " + err.message));
      } else if (!data) {
        reject(new Error("No session data found for the given session ID"));
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Protected routes that check if the request has a token
 */
const protectedRoute = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const sessionData = await extractSessionData(req);

    if (!sessionData) throw new Error("Invalid action, No session data found");

    const { accessToken, refreshToken } = sessionData;

    // verify access
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

export default protectedRoute;
