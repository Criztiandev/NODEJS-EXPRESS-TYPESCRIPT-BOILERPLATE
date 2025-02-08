import { Express } from "express";
import authRoutes from "./auth/auth.routes";
import otpRoutes from "./auth/otp.routes";
import accountRoutes from "./account/account.routes";
import caseRoutes from "./case/case.routes";
import testRoutes from "./test/test.routes";

const Routes = (app: Express) => {
  // Auth Route
  app.use("/api/auth", authRoutes);
  app.use("/api/auth/otp", otpRoutes);

  // Account Route
  app.use("/api/account", accountRoutes);

  // Case Route
  app.use("/api/case", caseRoutes);
  app.use("/api/test", testRoutes);
};

export default Routes;
