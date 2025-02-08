import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

// Base custom error class
export class CustomError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public name: string = "CustomError"
  ) {
    super(message);
    this.name = name;
    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Specific error classes
export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400, "BadRequestError");
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401, "UnauthorizedError");
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, 403, "ForbiddenError");
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404, "NotFoundError");
  }
}

export class InputValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400, "InputValidationError");
  }
}

export class ServerError extends CustomError {
  constructor(message: string) {
    super(message, 500, "ServerError");
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400, "ValidationError");
  }
}

// Middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: "Validation Error",
      details: Object.values(err.errors).map((error) => ({
        field: error.path,
        message: error.message,
      })),
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  // Handle custom errors
  const status = err instanceof CustomError ? err.status : 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
