import { Router } from "express";
import accountController from "../feature/account/controller/account.controller";
import protectedMiddleware from "../middleware/protected.middleware";
const router = Router();

const { protectedRoute } = protectedMiddleware;

router.get("/profile", [protectedRoute], accountController.details);
router.post("/logout", accountController.logout);

export default router;
