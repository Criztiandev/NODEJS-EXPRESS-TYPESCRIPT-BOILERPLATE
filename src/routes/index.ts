import express, { Express } from "express";
import sessionRoutes from "./session.routes";
import authRoutes from "./auth.routes";
import accountRoutes from "./account.routes";

const Routes = (app: Express) => {
  app.use("/session", sessionRoutes);
  app.use("/auth", authRoutes);
  app.use("/auth", accountRoutes);
};

export default Routes;
