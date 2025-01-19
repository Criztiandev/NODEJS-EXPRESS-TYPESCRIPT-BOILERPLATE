import { Router } from "express";
import accountController from "../feature/account/controller/account.controller";
const router = Router();

router.get("/profile", accountController.profile);
router.delete("/logout", accountController.logout);

export default router;
