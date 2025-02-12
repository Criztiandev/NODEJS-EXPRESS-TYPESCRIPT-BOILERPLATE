
    import { Router } from "express";
    import respondentController from "../../feature/respondent/controller/respondent.controller";

    const router = Router();

    router.get("/details/:id", respondentController.getRespondentDetails);
    router.get(
    "/soft-deleted/details/:id",
    respondentController.getSoftDeletedRespondentDetails
    );

    router.get("/all", respondentController.getAllRespondents);
    router.get("/soft-deleted/all", respondentController.getAllSoftDeletedRespondents);

    router.post("/create", respondentController.createRespondent);
    router.post("/restore/soft-deleted/:id", respondentController.restoreSoftDeletedRespondent);

    router.put("/details/:id", respondentController.updateRespondent);

    router.delete("/details/:id", respondentController.softDeleteRespondent);
    router.delete("/details/hard/:id", respondentController.hardDeleteRespondent);

    export default router;
  