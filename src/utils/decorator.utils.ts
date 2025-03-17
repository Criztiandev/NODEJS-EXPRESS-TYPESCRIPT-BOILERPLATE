import { NextFunction, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { SessionRequest } from "../types/express";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "./error.utils";
import { ZodError, ZodObject } from "zod";

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

// decorator.utils.ts
export function AsyncHandler() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      return expressAsyncHandler(originalMethod.bind(this))(
        ...(args as [any, any, any])
      );
    };
    return descriptor;
  };
}

// Decorator to validate request body using zod
type ValidationOptions = {
  isPartial?: boolean;
};

export function ZodValidation(
  schema: ZodObject<any, any>,
  options: ValidationOptions = {}
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (req: any, res: Response, next: NextFunction) {
      const validateAndExecute = async () => {
        try {
          // if req.body is empty, return the original method
          if (
            req.body === undefined ||
            req.body === null ||
            Object.keys(req.body).length === 0
          ) {
            // throw the validation error
            req.body = await schema.parseAsync(req.body);
          }

          // Use partial schema for updates, full schema for creation
          const validationSchema = options.isPartial
            ? schema.partial()
            : schema;

          // when partials is true. we need to check if the provided field is exists in the schema
          if (options.isPartial) {
            const providedFields = Object.keys(req.body);
            const schemaFields = validationSchema.shape;
            const missingFields = providedFields.filter(
              (field) => !(field in schemaFields)
            );
            if (missingFields.length > 0) {
              throw new BadRequestError(
                `Field doesn't exists: ${missingFields.join(", ")}`
              );
            }
          }

          // Validate the request body
          req.body = await validationSchema.parseAsync(req.body);

          // Call the original method with the current context
          return await originalMethod.call(this, req, res, next);
        } catch (error) {
          if (error instanceof ZodError) {
            return res.status(400).json({
              error: "Validation failed",
              details: getZodError(error),
              stack:
                process.env.NODE_ENV === "development" ? error.stack : null,
            });
          }
          throw error; // Let AsyncHandler catch other errors
        }
      };

      return validateAndExecute();
    };

    return descriptor;
  };
}

// Helper functionms

export function getZodError(error: ZodError) {
  return error.errors.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));
}
