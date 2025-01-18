import { Express } from "express";
import authRoutes from "./auth.routes";
import accountRoutes from "./account.routes";

const Routes = (app: Express) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/account", accountRoutes);
};

export default Routes;
