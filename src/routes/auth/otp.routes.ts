import { Router } from "express";
import otpController from "../../feature/auth/controller/otp.controller";
const router = Router();

router.post("/verify", otpController.verifyOTP);
router.post("/resend", otpController.resendOTP);

export default router;
