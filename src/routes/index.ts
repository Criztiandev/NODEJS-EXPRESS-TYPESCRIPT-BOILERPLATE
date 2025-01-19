import { Express } from "express";
import authRoutes from "./auth/auth.routes";
import otpRoutes from "./auth/otp.routes";
import accountRoutes from "./account/account.routes";

const Routes = (app: Express) => {
  // Auth Route
  app.use("/api/auth", authRoutes);
  app.use("/api/otp", otpRoutes);

  // Account Route
  app.use("/api/account", accountRoutes);
};

export default Routes;
