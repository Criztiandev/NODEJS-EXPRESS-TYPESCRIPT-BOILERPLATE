import { Request, Response } from "express";
import tokenUtils from "../../utils/token.utils";
import { SessionData as ExpressSessionData } from 'express-session';

interface CustomSessionData {
  accessToken: string;
  refreshToken: string;
}

function extractSessionData(req: Request, res: Response): Promise<CustomSessionData> {
  return new Promise((resolve, reject) => {
    req.sessionStore.get(
      req.sessionID,
      (err: any, session?: ExpressSessionData | null) => {
        if (err) {
          res.status(400);
          reject(new Error("Error retrieving session data: " + err.message));
        } else if (!session) {
          res.status(400);
          reject(new Error("No session data found for the given session ID"));
        } else {
          resolve(session as unknown as CustomSessionData);
        }
      }
    );
  });
}

export function ProtectedController() {
  return function (constructor: Function) {
    // Get all method names from the class prototype
    const propertyNames = Object.getOwnPropertyNames(constructor.prototype);

    // Loop through each method except constructor
    propertyNames.forEach((methodName) => {
      if (methodName !== "constructor") {
        const originalMethod = constructor.prototype[methodName];

        // Replace the original method with the protected version
        constructor.prototype[methodName] = async function (...args: any[]) {
          try {
            const [req, res] = args;
            const sessionData = await extractSessionData(req, res);

            if (!sessionData) {
              throw new Error("Invalid action, No session data found");
            }

            const { accessToken, refreshToken } = sessionData;
            const { payload, expired } = tokenUtils.verifyToken(accessToken);

            if (expired) {
              const refreshResult = tokenUtils.verifyToken(refreshToken);

              if (refreshResult.expired) {
                throw new Error("Refresh token expired");
              }

              const newAccessToken = tokenUtils.generateToken<any>(
                refreshResult.payload,
                "10s"
              );

              req.session.accessToken = newAccessToken;
              req.session.user = {
                ...refreshResult.payload,
                role: "user",
                verified: true,
              };
            } else {
              req.session.user = { ...payload, role: "user", verified: true };
            }

            // Call the original method if authentication passes
            return await originalMethod.apply(this, args);
          } catch (error) {
            if (error instanceof Error) {
              throw error;
            }
            throw new Error("An unexpected error occurred");
          }
        };
      }
    });
  };
}

// Optional: Add a decorator for public routes that bypass protection
export function PublicRoute() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.value.__public = true;
    return descriptor;
  };
}
