
    import { Router } from "express";
    import activityController from "../../feature/activity/controller/activity.controller";

    const router = Router();

    router.get("/details/:id", activityController.getActivityDetails);
    router.get(
    "/soft-deleted/details/:id",
    activityController.getSoftDeletedActivityDetails
    );

    router.get("/all", activityController.getAllActivitys);
    router.get("/soft-deleted/all", activityController.getAllSoftDeletedActivitys);

    router.post("/create", activityController.createActivity);
    router.post("/restore/soft-deleted/:id", activityController.restoreSoftDeletedActivity);

    router.put("/details/:id", activityController.updateActivity);

    router.delete("/details/:id", activityController.softDeleteActivity);
    router.delete("/details/hard/:id", activityController.hardDeleteActivity);

    export default router;
  