
    import { Router } from "express";
    import barangayController from "../../feature/barangay/controller/barangay.controller";

    const router = Router();

    router.get("/details/:id", barangayController.getBarangayDetails);
    router.get(
    "/soft-deleted/details/:id",
    barangayController.getSoftDeletedBarangayDetails
    );

    router.get("/all", barangayController.getAllBarangays);
    router.get("/soft-deleted/all", barangayController.getAllSoftDeletedBarangays);

    router.post("/create", barangayController.createBarangay);
    router.post("/restore/soft-deleted/:id", barangayController.restoreSoftDeletedBarangay);

    router.put("/details/:id", barangayController.updateBarangay);

    router.delete("/details/:id", barangayController.softDeleteBarangay);
    router.delete("/details/hard/:id", barangayController.hardDeleteBarangay);

    export default router;
  