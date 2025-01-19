import { NextFunction, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { SessionRequest } from "../types/express";
import { ForbiddenError, UnauthorizedError } from "./error.utils";

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
