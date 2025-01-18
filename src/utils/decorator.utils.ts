import { NextFunction, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { SessionRequest } from "../types/express";

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
      const [req, res] = args;
      const user = req.session.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!roles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden - Insufficient role" });
      }

      return originalMethod.apply(this, args);
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
