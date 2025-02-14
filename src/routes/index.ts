import { Express } from "express";
import authRoutes from "./auth/auth.routes";
import otpRoutes from "./auth/otp.routes";
import accountRoutes from "./account/account.routes";
import userRoutes from "./user/user.routes";
import barangayRoutes from "./barangay/barangay.routes";
import officialsRoutes from "./officials/officials.routes";
import caseRoutes from "./case/case.routes";
import casepartyRoutes from "./caseparty/case-party.routes";
import hearingRoutes from "./hearing/hearing.routes";
import documentsRoutes from "./documents/documents.routes";
import settlementRoutes from "./settlement/settlement.routes";
import notificationRoutes from "./notification/notification.routes";
import auditRoutes from "./audit/audit.routes";

const Routes = (app: Express) => {
  // Auth Route
  app.use("/api/auth", authRoutes);
  app.use("/api/auth/otp", otpRoutes);

  // Account Route
  app.use("/api/account", accountRoutes);
  app.use("/api/user", userRoutes);

  app.use("/api/barangay", barangayRoutes);
  app.use("/api/officials", officialsRoutes);
  app.use("/api/case", caseRoutes);
  app.use("/api/caseparty", casepartyRoutes);
  app.use("/api/hearing", hearingRoutes);
  app.use("/api/documents", documentsRoutes);
  app.use("/api/settlement", settlementRoutes);
  app.use("/api/notification", notificationRoutes);
  app.use("/api/audit", auditRoutes);
};

export default Routes;
