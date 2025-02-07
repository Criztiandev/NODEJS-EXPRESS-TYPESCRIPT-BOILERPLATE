import { Router } from "express";
import authController from "../../feature/auth/controller/auth.controller";
const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.post("/account/verify", authController.verifyDeletedAccount);

export default router;
