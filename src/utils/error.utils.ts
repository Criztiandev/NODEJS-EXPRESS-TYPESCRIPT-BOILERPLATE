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

export class ValidationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

export class InputError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "InputError";
    this.status = 400;
  }
}

export class AuthenticationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
    this.status = 401;
  }
}

export class AuthorizationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
    this.status = 403;
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

export class ConflictError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
    this.status = 409;
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

export class DatabaseError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
    this.status = 500;
  }
}

export class NetworkError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
    this.status = 503;
  }
}

export class ServerError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
    this.status = 500;
  }
}
