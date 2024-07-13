import { Router } from "express";
import authController from "../controller/auth.controller";
import sessionController from "../controller/session.controller";
const router = Router();

router.get("/refresh", sessionController.refereshAccessToken);

export default router;
