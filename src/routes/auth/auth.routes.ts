import { Router } from "express";
import authController from "../../feature/auth/controller/auth.controller";
const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);

router.post("/checkpoint/account/verify/:token", authController.verifyAccount);
router.post(
  "/checkpoint/account/reset-password/:token",
  authController.resetPassword
);
router.post(
  "/checkpoint/deleted-account/verify/:token",
  authController.verifyDeletedAccount
);

export default router;
