import { Router } from "express";
import accountController from "../controller/account.controller";
import protectedMiddleware from "../middleware/protected.middleware";
const router = Router();

router.get("/profile", accountController.details);
router.post("/logout", accountController.logout);

export default router;
