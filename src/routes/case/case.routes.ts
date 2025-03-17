import { Router } from "express";
import caseController from "../../feature/case/controller/case.controller";
import { bindControllerMethods } from "../../utils/routes.util";

const router = Router();
const controller = bindControllerMethods(caseController);

router.get("/details/:id", controller.getDetails);
router.get("/all", controller.getAll);
router.get("/:id/all", controller.getAllMyCases);

router.get("/soft-deleted/details/:id", controller.getSoftDeletedDetails);
router.get("/soft-deleted/all", controller.getAllSoftDeleted);

router.post("/create", controller.create);
router.post("/restore/soft-deleted/:id", controller.restoreSoftDeleted);

router.put("/details/:id", controller.update);
router.delete("/details/:id", controller.softDelete);
router.delete("/details/hard/:id", controller.hardDelete);

export default router;
