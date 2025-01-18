import { Express, Request, Response } from "express";
import morgan from "morgan";

/**
 * Setup morgan middleware
 * Morgan is a middleware that logs HTTP requests and responses
 * @param app - Express app
 * @returns void
 */
export const morganSetup = (app: Express): void => {
  const skipSwagger = (req: Request, res: Response): boolean => {
    return req.path.startsWith("/swagger") || req.path.startsWith("/api-docs");
  };

  const morganFormat =
    ":method :url :status :res[content-length] - :response-time ms";

  app.use(morgan(morganFormat, { skip: skipSwagger }));
};
