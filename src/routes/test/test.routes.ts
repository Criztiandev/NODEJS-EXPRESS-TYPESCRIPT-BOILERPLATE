
    import { Router } from "express";
    import testController from "../../feature/test/controller/test.controller";

    const router = Router();

    router.get("/details/:id", testController.getTestDetails);
    router.get(
    "/soft-deleted/details/:id",
    testController.getSoftDeletedTestDetails
    );

    router.get("/all", testController.getAllTests);
    router.get("/soft-deleted/all", testController.getAllSoftDeletedTests);

    router.post("/create", testController.createTest);
    router.post("/restore/soft-deleted/:id", testController.restoreSoftDeletedTest);

    router.put("/details/:id", testController.updateTest);

    router.delete("/details/:id", testController.softDeleteTest);
    router.delete("/details/hard/:id", testController.hardDeleteTest);

    export default router;
  