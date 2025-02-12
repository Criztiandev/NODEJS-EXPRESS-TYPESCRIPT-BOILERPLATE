import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import hearingscheduleService from "../service/hearing-schedule.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";

class HearingScheduleController {
  @AsyncHandler()
  async getHearingScheduleDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: hearingscheduleId } = req.params;

    const hearingscheduleCredentials =
      await hearingscheduleService.getHearingSchedule(hearingscheduleId);

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedule retrieved successfully",
    });
  }

  @AsyncHandler()
  async getSoftDeletedHearingScheduleDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: hearingscheduleId } = req.params;

    const hearingscheduleCredentials =
      await hearingscheduleService.getSoftDeletedHearingSchedule(
        hearingscheduleId
      );

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedule retrieved successfully",
    });
  }

  /**
   * Get all hearingschedules with pagination
   * /api/hearingschedules?search=urgent&status=open&priority=high
   * /api/hearingschedules?page=1&limit=10
   */
  @AsyncHandler()
  async getAllHearingSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const hearingscheduleCredentials =
      await hearingscheduleService.getPaginatedHearingSchedules(queryParams);

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedules retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllSoftDeletedHearingSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const hearingscheduleCredentials =
      await hearingscheduleService.getPaginatedSoftDeletedHearingSchedules(
        queryParams
      );

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedules retrieved successfully",
    });
  }

  @AsyncHandler()
  async createHearingSchedule(req: Request, res: Response, next: NextFunction) {
    const hearingscheduleCredentials =
      await hearingscheduleService.createHearingSchedule(req.body);

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedule created successfully",
    });
  }

  @AsyncHandler()
  async restoreSoftDeletedHearingSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: hearingscheduleId } = req.params;
    const hearingscheduleCredentials =
      await hearingscheduleService.restoreSoftDeletedHearingSchedule(
        hearingscheduleId
      );

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedule restored successfully",
    });
  }

  @AsyncHandler()
  async updateHearingSchedule(req: Request, res: Response, next: NextFunction) {
    const { id: hearingscheduleId } = req.params;
    const hearingscheduleCredentials =
      await hearingscheduleService.updateHearingSchedule(
        hearingscheduleId,
        req.body
      );

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedule updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdateHearingSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { hearingscheduleIds, updateData } = req.body;

    const hearingscheduleCredentials =
      await hearingscheduleService.batchUpdateHearingSchedulesById(
        hearingscheduleIds,
        updateData
      );

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedules updated successfully",
    });
  }

  @AsyncHandler()
  async softDeleteHearingSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: hearingscheduleId } = req.params;

    const hearingscheduleCredentials =
      await hearingscheduleService.softDeleteHearingSchedule(
        hearingscheduleId as unknown as ObjectId
      );

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedule deleted successfully",
    });
  }

  @AsyncHandler()
  async hardDeleteHearingSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { hearingscheduleId } = req.params;
    const hearingscheduleCredentials =
      await hearingscheduleService.hardDeleteHearingSchedule(
        hearingscheduleId as unknown as ObjectId
      );

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedule deleted successfully",
    });
  }

  @AsyncHandler()
  async batchSoftDeleteHearingSchedules(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { hearingscheduleIds } = req.body;
    const hearingscheduleCredentials =
      await hearingscheduleService.batchSoftDeleteHearingSchedules(
        hearingscheduleIds
      );

    res.status(200).json({
      payload: hearingscheduleCredentials,
      message: "hearingschedules soft deleted successfully",
    });
  }
}

export default new HearingScheduleController();
