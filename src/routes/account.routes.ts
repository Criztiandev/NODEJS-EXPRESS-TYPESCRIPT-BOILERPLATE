import { Router } from "express";
import accountController from "../controller/account.controller";
import requirementsMiddleware from "../middleware/requirements.middleware";
const router = Router();

const { reqUser } = requirementsMiddleware;

router.post("/profile", [reqUser], accountController.details);
router.post("/logout", [reqUser], accountController.logout);

export default router;
