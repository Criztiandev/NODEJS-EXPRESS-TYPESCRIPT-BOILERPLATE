import { Router } from "express";
import accountController from "../feature/account/controller/account.controller";
const router = Router();

router.get("/profile", accountController.details);
router.post("/logout", accountController.logout);

export default router;
