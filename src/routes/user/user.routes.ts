import { Router } from "express";
import userController from "../../feature/user/controller/user.controller";
import { bindControllerMethods } from "../../utils/routes.util";

const router = Router();
const controller = bindControllerMethods(userController);

router.get("/details/:id", controller.getDetails);
router.get("/soft-deleted/details/:id", controller.getSoftDeletedDetails);
router.get("/all", controller.getAll);
router.get("/soft-deleted/all", controller.getAllSoftDeleted);
router.post("/create", controller.create);
router.post("/restore/soft-deleted/:id", controller.restoreSoftDeleted);
router.put("/details/:id", controller.update);
router.delete("/details/:id", controller.softDelete);
router.delete("/details/hard/:id", controller.hardDelete);

export default router;
