import { Router } from "express";
import caseController from "../../feature/case/controller/case.controller";

const router = Router();

router.get("/details/:id", caseController.getCaseDetails);
router.get(
  "/soft-deleted/details/:id",
  caseController.getSoftDeletedCaseDetails
);

router.get("/all", caseController.getAllCases);
router.get("/soft-deleted/all", caseController.getAllSoftDeletedCases);

router.post("/create", caseController.createCase);
router.post("/restore/soft-deleted/:id", caseController.restoreSoftDeletedCase);

router.put("/details/:id", caseController.updateCase);

router.delete("/details/:id", caseController.softDeleteCase);
router.delete("/details/hard/:id", caseController.hardDeleteCase);

export default router;
