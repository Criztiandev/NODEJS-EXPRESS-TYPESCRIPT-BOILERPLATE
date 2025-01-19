import { Express } from "express";
import authRoutes from "./auth.routes";
import accountRoutes from "./account.routes";
import otpRoutes from "./otp.routes";

const Routes = (app: Express) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/account", accountRoutes);
  app.use("/api/otp", otpRoutes);
};

export default Routes;
