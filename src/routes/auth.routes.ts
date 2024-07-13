import { Router } from "express";
import authController from "../controller/auth.controller";
const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.post("/checkpoint/:id", authController.verifyAccount);
router.put("/checkpoint/change-password/:id", authController.changePassword);

export default router;
