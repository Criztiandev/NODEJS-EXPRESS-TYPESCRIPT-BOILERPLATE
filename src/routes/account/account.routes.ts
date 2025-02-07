import { Router } from "express";
import accountController from "../../feature/account/controller/account.controller";
const router = Router();

router.get("/profile", accountController.profile);
router.put("/update", accountController.updateProfile);
router.delete("/logout", accountController.logout);

router.delete("/delete", accountController.softDeleteAccount);

router.put("/reset-password/:token", accountController.resetPassword);

router.put("/restore/:token", accountController.restoreAccount);

export default router;
