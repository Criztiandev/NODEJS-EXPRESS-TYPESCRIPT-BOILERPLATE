import express, { Express } from "express";
import authRoutes from "./auth.routes";
import accountRoutes from "./account.routes";

const Routes = (app: Express) => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       required:
   *         - firstName
   *         - middleName
   *         - lastName
   *         - email
   *         - password
   *       properties:
   *        UID:
   *         - type: string
   *         - description: The auto generated id of the user
   *        firstName:
   *         - type: string
   *         - description: The first name of the user
   *        middleName:
   *         - type: string
   *         - description: The middle name of the user which is can be optional
   *        lastName:
   *         - type: string
   *         - description: The middle name of the user
   *        email:
   *         - type: string
   *         - description: Them email of the user
   *        password:
   *         - type: string
   *         - description: The password of the user
   *       example:
   *         UID: 234234234234
   *         firstName: John
   *         middleName: D.
   *         lastName: Doe
   *         email: criztiandev@gmail.com
   *         password: hackerako890--
   */

  app.use("/api/auth", authRoutes);
  app.use("/api/account", accountRoutes);
};

export default Routes;
