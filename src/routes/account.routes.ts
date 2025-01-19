import { Router } from "express";
import accountController from "../feature/account/controller/account.controller";
const router = Router();

router.get("/profile", accountController.profile);
router.put("/update", accountController.updateProfile);
router.delete("/delete", accountController.deleteAccount);
router.delete("/logout", accountController.logout);

export default router;
