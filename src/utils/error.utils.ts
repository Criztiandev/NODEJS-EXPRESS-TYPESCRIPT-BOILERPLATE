import { NextFunction, Request, Response } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export class BadRequestError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.status = 400;
  }
}

export class InputValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "InputValidationError";
    this.status = 400;
  }
}

export class ValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

// validation for if the crendetials are not found
export class CredentialsNotFoundError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "CredentialsNotFoundError";
    this.status = 401;
  }
}

export class UnauthorizedError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

export class NotFoundError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class InternalServerError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
    this.status = 500;
  }
}

export class ForbiddenError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.status = 403;
  }
}

export class RateLimitError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
    this.status = 429;
  }
}

export class ConflictError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.status = 409;
  }
}
