import { Express } from "express";
import authRoutes from "./auth/auth.routes";
import otpRoutes from "./auth/otp.routes";
import accountRoutes from "./account/account.routes";
import userRoutes from "./user/user.routes";
import caseRoutes from "./case/case.routes";

const Routes = (app: Express) => {
  // Auth Route
  app.use("/api/auth", authRoutes);
  app.use("/api/auth/otp", otpRoutes);

  // Account Route
  app.use("/api/account", accountRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/case", caseRoutes);
};

export default Routes;
