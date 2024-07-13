declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: number;
      JWT_SECRET: string;
      SESSION_SECRET: string;
    }
  }
}

export {};
