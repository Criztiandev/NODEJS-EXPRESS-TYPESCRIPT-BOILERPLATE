
    import { Router } from "express";
    import mediatorController from "../../feature/mediator/controller/mediator.controller";

    const router = Router();

    router.get("/details/:id", mediatorController.getMediatorDetails);
    router.get(
    "/soft-deleted/details/:id",
    mediatorController.getSoftDeletedMediatorDetails
    );

    router.get("/all", mediatorController.getAllMediators);
    router.get("/soft-deleted/all", mediatorController.getAllSoftDeletedMediators);

    router.post("/create", mediatorController.createMediator);
    router.post("/restore/soft-deleted/:id", mediatorController.restoreSoftDeletedMediator);

    router.put("/details/:id", mediatorController.updateMediator);

    router.delete("/details/:id", mediatorController.softDeleteMediator);
    router.delete("/details/hard/:id", mediatorController.hardDeleteMediator);

    export default router;
  