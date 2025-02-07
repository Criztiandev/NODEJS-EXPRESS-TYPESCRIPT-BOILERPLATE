import { NextFunction, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { SessionRequest } from "../types/express";
import { ForbiddenError, UnauthorizedError } from "./error.utils";
import { z, ZodError } from "zod";

export function AllowedRoles(roles: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (
      ...args: [SessionRequest, Response, NextFunction]
    ) {
      const [req] = args;
      const user = req.session.user;

      if (!user) {
        throw new UnauthorizedError("Unauthorized");
      }

      if (!roles.includes(user.role)) {
        throw new ForbiddenError("Role not allowed");
      }

      return originalMethod.apply(this as unknown as object, args);
    };

    return descriptor;
  };
}

export function AsyncHandler() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = expressAsyncHandler(originalMethod);
    return descriptor;
  };
}

// Decorator to validate request body using zod
export function ZodValidation(schema: z.ZodObject<any, any>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        schema.parse(req.body);
        return await originalMethod.apply(this, [req, res, next]);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessages = error.errors.map((issue) => ({
            message: `${issue.path.join(".")} is ${issue.message}`,
          }));
          return res.status(400).json({
            error: "Invalid data",
            details: errorMessages,
          });
        }
        next(error);
      }
    };

    return descriptor;
  };
}
