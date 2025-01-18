import { Router } from "express";
import authController from "../controller/auth.controller";
import validationMiddlware from "../middleware/validation.middlware";
import { registrationValidation } from "../service/validation/auth.validation";
const router = Router();

const { validate } = validationMiddlware;

router.post("/login", authController.login);
router.post(
  "/register",
  [validate(registrationValidation)],
  authController.register
);
router.post("/forgot-password", authController.forgotPassword);
router.post("/checkpoint/:id", authController.verifyAccount);
router.put("/checkpoint/change-password/:id", authController.changePassword);

export default router;
