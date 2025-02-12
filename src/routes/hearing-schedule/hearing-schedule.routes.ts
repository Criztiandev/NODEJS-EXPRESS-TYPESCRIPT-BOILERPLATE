import { Router } from "express";
import hearingscheduleController from "../../feature/hearing-schedule/controller/hearingschedule.controller";

const router = Router();

router.get("/details/:id", hearingscheduleController.getHearingScheduleDetails);
router.get(
  "/soft-deleted/details/:id",
  hearingscheduleController.getSoftDeletedHearingScheduleDetails
);

router.get("/all", hearingscheduleController.getAllHearingSchedules);
router.get(
  "/soft-deleted/all",
  hearingscheduleController.getAllSoftDeletedHearingSchedules
);

router.post("/create", hearingscheduleController.createHearingSchedule);
router.post(
  "/restore/soft-deleted/:id",
  hearingscheduleController.restoreSoftDeletedHearingSchedule
);

router.put("/details/:id", hearingscheduleController.updateHearingSchedule);

router.delete(
  "/details/:id",
  hearingscheduleController.softDeleteHearingSchedule
);
router.delete(
  "/details/hard/:id",
  hearingscheduleController.hardDeleteHearingSchedule
);

export default router;
