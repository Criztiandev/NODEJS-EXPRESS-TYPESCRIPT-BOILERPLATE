import "express-session";
import { User } from "../../src/types/models/user";

declare module "express-session" {
  interface Session {
    visited?: boolean;
    accessToken: string;
    refreshToken: string;

    user: Pick<User, "_id" | "role" | "email"> & {
      fullName: string;
    };
  }
}

export {};