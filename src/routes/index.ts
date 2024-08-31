import express, { Express } from "express";
import authRoutes from "./auth.routes";
import accountRoutes from "./account.routes";
import protectedRoute from "../middleware/protected.middleware";

const Routes = (app: Express) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/account", [protectedRoute], accountRoutes);
};

export default Routes;
