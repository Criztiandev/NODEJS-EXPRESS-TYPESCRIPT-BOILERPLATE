import { Express } from "express";
import authRoutes from "./auth/auth.routes";
import otpRoutes from "./auth/otp.routes";
import accountRoutes from "./account/account.routes";
import caseRoutes from "./case/case.routes";
import activityRoutes from "./activity/activity.routes";
import barangayRoutes from "./barangay/barangay.routes";
import headeringScheduleRoutes from "./hearing-schedule/hearing-schedule.routes";
import complainantRoutes from "./complainant/complainant.routes";
import respondentRoutes from "./respondent/respondent.routes";
import mediatorRoutes from "./mediator/mediator.routes";

const Routes = (app: Express) => {
  // Auth Route
  app.use("/api/auth", authRoutes);
  app.use("/api/auth/otp", otpRoutes);

  // Account Route
  app.use("/api/account", accountRoutes);

  app.use("/api/case", caseRoutes);
  app.use("/api/activity", activityRoutes);
  app.use("/api/barangay", barangayRoutes);
  app.use("/api/hearing-schedule", headeringScheduleRoutes);
  app.use("/api/complainant", complainantRoutes);
  app.use("/api/respondent", respondentRoutes);
  app.use("/api/mediator", mediatorRoutes);
};

export default Routes;
