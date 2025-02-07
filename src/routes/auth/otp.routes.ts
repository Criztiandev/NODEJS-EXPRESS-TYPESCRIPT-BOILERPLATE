import { Router } from "express";
import otpController from "../../feature/auth/controller/otp.controller";
const router = Router();

router.post("/resend/:token", otpController.resendOTP);

export default router;
