
import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import activityService from "../service/activity.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";


class ActivityController {
  @AsyncHandler()
  async getActivityDetails(req: Request, res: Response, next: NextFunction) {

    const { id: activityId } = req.params;


    const activityCredentials = await activityService.getActivity(activityId);

    res.status(200).json({
      payload: activityCredentials,
      message: "activity retrieved successfully",
    });
  }

  @AsyncHandler()
  async getSoftDeletedActivityDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: activityId } = req.params;

    const activityCredentials = await activityService.getSoftDeletedActivity(activityId);

    res.status(200).json({
      payload: activityCredentials,
      message: "activity retrieved successfully",
    });
  }

  /**
   * Get all activitys with pagination
   * /api/activitys?search=urgent&status=open&priority=high
   * /api/activitys?page=1&limit=10
   */
  @AsyncHandler()
  async getAllActivitys(req: Request, res: Response, next: NextFunction) {
    const queryParams: QueryParams = req.query as QueryParams;

    const activityCredentials = await activityService.getPaginatedActivitys(queryParams);

    res.status(200).json({
      payload: activityCredentials,
      message: "activitys retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllSoftDeletedActivitys(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const activityCredentials = await activityService.getPaginatedSoftDeletedActivitys(
      queryParams
    );


    res.status(200).json({
      payload: activityCredentials,
      message: "activitys retrieved successfully",
    });
  }

  @AsyncHandler()
  async createActivity(req: Request, res: Response, next: NextFunction) {
    const activityCredentials = await activityService.createActivity(req.body);

    res.status(200).json({
      payload: activityCredentials,
      message: "activity created successfully",
    });
  }

  @AsyncHandler()
  async restoreSoftDeletedActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: activityId } = req.params;
    const activityCredentials = await activityService.restoreSoftDeletedActivity(activityId);

    res.status(200).json({
      payload: activityCredentials,
      message: "activity restored successfully",
    });
  }

  @AsyncHandler()
  async updateActivity(req: Request, res: Response, next: NextFunction) {
    const { id: activityId } = req.params;
    const activityCredentials = await activityService.updateActivity(activityId, req.body);

    res.status(200).json({
      payload: activityCredentials,
      message: "activity updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdateActivitys(req: Request, res: Response, next: NextFunction) {
    const { activityIds, updateData } = req.body;

    const activityCredentials = await activityService.batchUpdateActivitysById(
      activityIds,
      updateData
    );

    res.status(200).json({
      payload: activityCredentials,
      message: "activitys updated successfully",
    });
  }

  @AsyncHandler()
  async softDeleteActivity(req: Request, res: Response, next: NextFunction) {
    const { id: activityId } = req.params;

    const activityCredentials = await activityService.softDeleteActivity(
      activityId as unknown as ObjectId
    );

    res.status(200).json({
      payload: activityCredentials,
      message: "activity deleted successfully",
    });
  }

  @AsyncHandler()
  async hardDeleteActivity(req: Request, res: Response, next: NextFunction) {
    const { activityId } = req.params;
    const activityCredentials = await activityService.hardDeleteActivity(
      activityId as unknown as ObjectId
    );

    res.status(200).json({
      payload: activityCredentials,
      message: "activity deleted successfully",
    });
  }

  @AsyncHandler()
  async batchSoftDeleteActivitys(req: Request, res: Response, next: NextFunction) {
    const { activityIds } = req.body;
    const activityCredentials = await activityService.batchSoftDeleteActivitys(activityIds);

    res.status(200).json({
      payload: activityCredentials,
      message: "activitys soft deleted successfully",
    });
  }
}

export default new ActivityController();
