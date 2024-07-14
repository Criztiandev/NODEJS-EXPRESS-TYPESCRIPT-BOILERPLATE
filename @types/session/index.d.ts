import "express-session";

declare module "express-session" {
  interface SessionData {
    visited?: boolean;

    accessToken: string;
    refreshToken: string;
    user?: any;
  }
}

export {};
