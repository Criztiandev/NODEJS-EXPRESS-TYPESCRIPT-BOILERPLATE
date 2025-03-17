import { Request, Response, NextFunction } from "express";
import tokenUtils from "../../utils/token.utils";
import userModel from "../../model/user.model";
import { BadRequestError } from "../../utils/error.utils";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../feature/auth/interface/auth/token.interface";

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Validates the user's session and handles token refresh
 * @param req Express Request object
 * @throws AuthenticationError if session is invalid
 * @throws BadRequestError if user/token validation fails
 */
async function validateSession(req: Request): Promise<void> {
  // Verify session exists
  if (!req.session) {
    throw new AuthenticationError("No session found");
  }

  // Verify session is valid in store
  await verifySessionInStore(req);

  // Check session has required auth data
  if (!req.session.user || !req.session.accessToken) {
    throw new AuthenticationError("User not authenticated");
  }

  await handleTokenRefresh(req);
}

/**
 * Verifies the session exists in session store
 */
async function verifySessionInStore(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.sessionStore.get(req.session.id, (err, session) => {
      if (err) {
        console.error("Session verification error:", err);
        return reject(new AuthenticationError(err.message));
      }
      if (!session) {
        return reject(new AuthenticationError("Session not found in store"));
      }
      resolve();
    });
  });
}

/**
 * Handles access token refresh using refresh token if needed
 */
async function handleTokenRefresh(req: Request): Promise<void> {
  const { payload: accessTokenPayload, expired: accessTokenExpired } =
    tokenUtils.verifyToken<AccessTokenPayload>(req.session.accessToken);

  if (!accessTokenExpired || !accessTokenPayload) {
    return;
  }

  const user = await userModel.findById(accessTokenPayload?.UID || "");
  if (!user?.refreshToken) {
    throw new BadRequestError("User or refresh token not found");
  }

  const { payload: refreshTokenPayload, expired: refreshTokenExpired } =
    tokenUtils.verifyToken<RefreshTokenPayload>(user.refreshToken);

  if (refreshTokenExpired) {
    await destroySession(req);
    throw new AuthenticationError("Session expired");
  }

  if (refreshTokenPayload?.UID === accessTokenPayload?.UID) {
    // Generate new access token
    const newAccessToken = tokenUtils.generateToken({
      UID: accessTokenPayload?.UID,
    });
    req.session.accessToken = newAccessToken;

    // Save the session to ensure the new token is persisted
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error("Failed to save session:", err);
          reject(new BadRequestError("Failed to refresh token"));
        }
        resolve();
      });
    });
  }
}

/**
 * Safely destroys the session
 */
async function destroySession(req: Request): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return reject(new BadRequestError("Failed to destroy session"));
      }
      resolve();
    });
  });
}

// Symbol to mark methods as processed to avoid duplicate wrapping
const PROTECTED_METHOD = Symbol("PROTECTED_METHOD");

// Improved storage for public routes using class+method as key
const publicRouteRegistry = new Map<string, boolean>();

/**
 * Registers a route as public
 */
function registerPublicRoute(target: any, methodName: string | symbol) {
  const key = getRouteKey(target.constructor, methodName);
  publicRouteRegistry.set(key, true);
}

/**
 * Checks if a route is marked as public
 */
function isPublicRoute(target: any, methodName: string | symbol): boolean {
  // Handle case where target might be undefined or null
  if (!target) {
    return false;
  }

  // Get the constructor, handling the case where it might be a constructor function or an instance
  let currentTarget =
    typeof target === "function" ? target : target.constructor;

  if (!currentTarget) {
    return false;
  }

  // Check the entire prototype chain
  while (currentTarget && currentTarget.name) {
    const key = getRouteKey(currentTarget, methodName);
    if (publicRouteRegistry.get(key)) {
      return true;
    }
    currentTarget = Object.getPrototypeOf(currentTarget);
  }

  return false;
}

/**
 * Generates a unique key for a route
 */
function getRouteKey(
  targetConstructor: any,
  methodName: string | symbol
): string {
  return `${targetConstructor.name}:${String(methodName)}`;
}

/**
 * Enhanced ProtectedController decorator that handles inherited methods
 * Using generic type parameter to preserve the constructor type
 */
export function ProtectedController() {
  return function <T extends { new (...args: any[]): any }>(constructor: T): T {
    // Process the constructor's prototype and all inherited prototypes
    processPrototypeChain(constructor);

    // Return the original constructor with its type preserved
    return constructor;
  };
}

/**
 * Processes all prototypes in the inheritance chain
 */
function processPrototypeChain(constructor: Function) {
  let currentProto = constructor.prototype;

  while (currentProto && currentProto !== Object.prototype) {
    processPrototype(constructor, currentProto);
    currentProto = Object.getPrototypeOf(currentProto);
  }
}

/**
 * Processes a single prototype, adding protection to its methods
 */
function processPrototype(target: any, proto: any) {
  if (!proto) return;

  try {
    const descriptors = Object.getOwnPropertyDescriptors(proto);

    Object.entries(descriptors).forEach(([methodName, descriptor]) => {
      // Skip if not a method, is constructor, or already processed
      if (
        !descriptor.value ||
        !(descriptor.value instanceof Function) ||
        methodName === "constructor" ||
        descriptor.value[PROTECTED_METHOD] === true
      ) {
        return;
      }

      const originalMethod = descriptor.value;

      // Create protected version of method
      const protectedMethod = async function (
        this: any,
        req: Request,
        res: Response,
        next?: NextFunction
      ) {
        try {
          // Only validate session if not marked as public
          const isPublic = isPublicRoute(this, methodName);
          if (!isPublic) {
            await validateSession(req);
          }
          return await originalMethod.apply(this, [req, res, next]);
        } catch (error) {
          if (error instanceof AuthenticationError) {
            return res.status(401).json({
              error: "Authentication failed",
              message: error.message,
            });
          }
          // Pass other errors to Express error handler
          if (next) {
            return next(error);
          }
          // If no next function, handle error here
          console.error(`Unhandled error in ${methodName}:`, error);
          return res.status(500).json({
            error: "Internal server error",
            message: "An unexpected error occurred",
          });
        }
      };

      // Mark as processed to avoid re-wrapping
      Object.defineProperty(protectedMethod, PROTECTED_METHOD, {
        value: true,
        writable: false,
        configurable: false,
      });

      // Replace the original method with the protected one
      Object.defineProperty(proto, methodName, {
        ...descriptor,
        value: protectedMethod,
      });
    });
  } catch (error) {
    console.error("Error processing prototype:", error);
  }
}

/**
 * Decorator to mark a route as public (no authentication required)
 */
export function PublicRoute() {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // Register this route as public
    registerPublicRoute(target, propertyKey);

    return descriptor;
  };
}
