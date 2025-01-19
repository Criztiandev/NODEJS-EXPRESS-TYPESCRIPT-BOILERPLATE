import { Router } from "express";
import otpController from "../../feature/auth/controller/otp.controller";
const router = Router();

router.post("/generate", otpController.generateOTP);
router.post("/verify", otpController.verifyOTP);
router.post("/resend", otpController.resendOTP);
router.post("/check", otpController.checkOTP);

export default router;
