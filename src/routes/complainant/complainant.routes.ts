
    import { Router } from "express";
    import complainantController from "../../feature/complainant/controller/complainant.controller";

    const router = Router();

    router.get("/details/:id", complainantController.getComplainantDetails);
    router.get(
    "/soft-deleted/details/:id",
    complainantController.getSoftDeletedComplainantDetails
    );

    router.get("/all", complainantController.getAllComplainants);
    router.get("/soft-deleted/all", complainantController.getAllSoftDeletedComplainants);

    router.post("/create", complainantController.createComplainant);
    router.post("/restore/soft-deleted/:id", complainantController.restoreSoftDeletedComplainant);

    router.put("/details/:id", complainantController.updateComplainant);

    router.delete("/details/:id", complainantController.softDeleteComplainant);
    router.delete("/details/hard/:id", complainantController.hardDeleteComplainant);

    export default router;
  