import "express-session";

declare module "express-session" {
  interface Session {
    user: any;
    accessToken: string;
  }
}

// No need for export {} since this is a declaration file
