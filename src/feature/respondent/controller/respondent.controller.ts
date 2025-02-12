
import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import respondentService from "../service/respondent.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";


class RespondentController {
  @AsyncHandler()
  async getRespondentDetails(req: Request, res: Response, next: NextFunction) {

    const { id: respondentId } = req.params;


    const respondentCredentials = await respondentService.getRespondent(respondentId);

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondent retrieved successfully",
    });
  }

  @AsyncHandler()
  async getSoftDeletedRespondentDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: respondentId } = req.params;

    const respondentCredentials = await respondentService.getSoftDeletedRespondent(respondentId);

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondent retrieved successfully",
    });
  }

  /**
   * Get all respondents with pagination
   * /api/respondents?search=urgent&status=open&priority=high
   * /api/respondents?page=1&limit=10
   */
  @AsyncHandler()
  async getAllRespondents(req: Request, res: Response, next: NextFunction) {
    const queryParams: QueryParams = req.query as QueryParams;

    const respondentCredentials = await respondentService.getPaginatedRespondents(queryParams);

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondents retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllSoftDeletedRespondents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const respondentCredentials = await respondentService.getPaginatedSoftDeletedRespondents(
      queryParams
    );


    res.status(200).json({
      payload: respondentCredentials,
      message: "respondents retrieved successfully",
    });
  }

  @AsyncHandler()
  async createRespondent(req: Request, res: Response, next: NextFunction) {
    const respondentCredentials = await respondentService.createRespondent(req.body);

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondent created successfully",
    });
  }

  @AsyncHandler()
  async restoreSoftDeletedRespondent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: respondentId } = req.params;
    const respondentCredentials = await respondentService.restoreSoftDeletedRespondent(respondentId);

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondent restored successfully",
    });
  }

  @AsyncHandler()
  async updateRespondent(req: Request, res: Response, next: NextFunction) {
    const { id: respondentId } = req.params;
    const respondentCredentials = await respondentService.updateRespondent(respondentId, req.body);

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondent updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdateRespondents(req: Request, res: Response, next: NextFunction) {
    const { respondentIds, updateData } = req.body;

    const respondentCredentials = await respondentService.batchUpdateRespondentsById(
      respondentIds,
      updateData
    );

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondents updated successfully",
    });
  }

  @AsyncHandler()
  async softDeleteRespondent(req: Request, res: Response, next: NextFunction) {
    const { id: respondentId } = req.params;

    const respondentCredentials = await respondentService.softDeleteRespondent(
      respondentId as unknown as ObjectId
    );

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondent deleted successfully",
    });
  }

  @AsyncHandler()
  async hardDeleteRespondent(req: Request, res: Response, next: NextFunction) {
    const { respondentId } = req.params;
    const respondentCredentials = await respondentService.hardDeleteRespondent(
      respondentId as unknown as ObjectId
    );

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondent deleted successfully",
    });
  }

  @AsyncHandler()
  async batchSoftDeleteRespondents(req: Request, res: Response, next: NextFunction) {
    const { respondentIds } = req.body;
    const respondentCredentials = await respondentService.batchSoftDeleteRespondents(respondentIds);

    res.status(200).json({
      payload: respondentCredentials,
      message: "respondents soft deleted successfully",
    });
  }
}

export default new RespondentController();
