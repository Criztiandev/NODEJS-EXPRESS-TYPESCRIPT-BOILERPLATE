import { Request, Response, NextFunction } from "express";
import tokenUtils from "../../utils/token.utils";

// Extend the session type to include our custom properties
// Create a custom error for authentication failures
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

async function validateSession(req: Request) {
  if (!req.session) {
    throw new AuthenticationError("No session found");
  }

  await new Promise((resolve, reject) => {
    req.sessionStore.get(req.session.id, (err, session) => {
      if (err) {
        reject(new AuthenticationError(err.message));
      }

      resolve(session);
    });
  });

  if (!req.session.user || !req.session.accessToken) {
    throw new AuthenticationError("User not authenticated");
  }

  const token = tokenUtils.verifyToken(req.session.accessToken);

  console.log(token);
}

/**
 * Decorator factory function that protects routes by checking for valid session
 * @returns MethodDecorator
 */
export function ProtectedController() {
  return function (constructor: Function) {
    // Store the original methods
    const originalMethods = Object.getOwnPropertyDescriptors(
      constructor.prototype
    );

    // Iterate through all methods in the controller
    Object.entries(originalMethods).forEach(([propertyName, descriptor]) => {
      // Skip if it's not a method or if it's the constructor
      if (
        !(descriptor.value instanceof Function) ||
        propertyName === "constructor"
      ) {
        return;
      }

      // Store the original method
      const originalMethod = descriptor.value;

      // Replace the method with our protected version
      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        try {
          await validateSession(req);
          return await originalMethod.apply(this, [req, res, next]);
        } catch (error) {
          if (error instanceof AuthenticationError) {
            return res.status(401).json({ message: error.message });
          }
          next(error);
        }
      };

      // Update the prototype with our new method
      Object.defineProperty(constructor.prototype, propertyName, descriptor);
    });
  };
}
