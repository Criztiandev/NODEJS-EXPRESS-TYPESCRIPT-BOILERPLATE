import { Request, Response, NextFunction } from "express";
import tokenUtils from "../../utils/token.utils";
import userModel from "../../model/user.model";
import { BadRequestError } from "../../utils/error.utils";

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
  await new Promise((resolve, reject) => {
    req.sessionStore.get(req.session.id, (err, session) => {
      if (err) {
        console.log(err);
        reject(new AuthenticationError(err.message));
      }
      resolve(session);
    });
  });
}

/**
 * Handles access token refresh using refresh token if needed
 */
async function handleTokenRefresh(req: Request): Promise<void> {
  const { payload: accessTokenPayload, expired: accessTokenExpired } =
    tokenUtils.verifyToken(req.session.accessToken);

  if (!accessTokenExpired) return;

  const user = await userModel.findById(accessTokenPayload?.userId || "");
  if (!user?.refreshToken) {
    throw new BadRequestError("User or refresh token not found");
  }

  const { payload: refreshTokenPayload, expired: refreshTokenExpired } =
    tokenUtils.verifyToken(user.refreshToken);

  if (refreshTokenExpired) {
    await destroySession(req);
    return;
  }

  if (refreshTokenPayload?.usedId === accessTokenPayload?.userId) {
    // Generate new access token
    const newAccessToken = tokenUtils.generateToken({
      userId: accessTokenPayload?.userId,
    });
    req.session.accessToken = newAccessToken;
  }
}

/**
 * Safely destroys the session
 */
async function destroySession(req: Request): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(new BadRequestError("Failed to destroy session"));
      resolve();
    });
  });
}

/**
 * Class decorator that protects routes by validating session and handling token refresh
 * @returns ClassDecorator
 */
export function ProtectedController() {
  return function (constructor: Function) {
    const originalMethods = Object.getOwnPropertyDescriptors(
      constructor.prototype
    );

    // Add session validation to each controller method
    Object.entries(originalMethods).forEach(([propertyName, descriptor]) => {
      if (
        !(descriptor.value instanceof Function) ||
        propertyName === "constructor"
      ) {
        return;
      }

      const originalMethod = descriptor.value;

      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        try {
          if (!isPublicRoute(constructor.prototype, propertyName)) {
            await validateSession(req);
          }
          return await originalMethod.apply(this, [req, res, next]);
        } catch (error) {
          if (error instanceof AuthenticationError) {
            return res.status(401).json({ message: error.message });
          }
          next(error);
        }
      };

      Object.defineProperty(constructor.prototype, propertyName, descriptor);
    });
  };
}

const publicRoutes = new WeakMap<object, Set<string | symbol>>();

/**
 * Decorator to mark controller methods as public routes that bypass authentication
 * @returns MethodDecorator
 */
export function PublicRoute() {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    let routes = publicRoutes.get(target);
    if (!routes) {
      routes = new Set();
      publicRoutes.set(target, routes);
    }
    routes.add(propertyKey);
    return descriptor;
  };
}

/**
 * Helper function to check if a route is marked as public
 * @param target The class prototype
 * @param propertyKey The method name
 * @returns boolean
 */
function isPublicRoute(target: any, propertyKey: string | symbol): boolean {
  const routes = publicRoutes.get(target);
  return routes ? routes.has(propertyKey) : false;
}
