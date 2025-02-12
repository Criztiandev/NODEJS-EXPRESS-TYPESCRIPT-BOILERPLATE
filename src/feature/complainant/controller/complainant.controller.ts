
import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import complainantService from "../service/complainant.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";


class ComplainantController {
  @AsyncHandler()
  async getComplainantDetails(req: Request, res: Response, next: NextFunction) {

    const { id: complainantId } = req.params;


    const complainantCredentials = await complainantService.getComplainant(complainantId);

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainant retrieved successfully",
    });
  }

  @AsyncHandler()
  async getSoftDeletedComplainantDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: complainantId } = req.params;

    const complainantCredentials = await complainantService.getSoftDeletedComplainant(complainantId);

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainant retrieved successfully",
    });
  }

  /**
   * Get all complainants with pagination
   * /api/complainants?search=urgent&status=open&priority=high
   * /api/complainants?page=1&limit=10
   */
  @AsyncHandler()
  async getAllComplainants(req: Request, res: Response, next: NextFunction) {
    const queryParams: QueryParams = req.query as QueryParams;

    const complainantCredentials = await complainantService.getPaginatedComplainants(queryParams);

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainants retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllSoftDeletedComplainants(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const complainantCredentials = await complainantService.getPaginatedSoftDeletedComplainants(
      queryParams
    );


    res.status(200).json({
      payload: complainantCredentials,
      message: "complainants retrieved successfully",
    });
  }

  @AsyncHandler()
  async createComplainant(req: Request, res: Response, next: NextFunction) {
    const complainantCredentials = await complainantService.createComplainant(req.body);

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainant created successfully",
    });
  }

  @AsyncHandler()
  async restoreSoftDeletedComplainant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: complainantId } = req.params;
    const complainantCredentials = await complainantService.restoreSoftDeletedComplainant(complainantId);

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainant restored successfully",
    });
  }

  @AsyncHandler()
  async updateComplainant(req: Request, res: Response, next: NextFunction) {
    const { id: complainantId } = req.params;
    const complainantCredentials = await complainantService.updateComplainant(complainantId, req.body);

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainant updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdateComplainants(req: Request, res: Response, next: NextFunction) {
    const { complainantIds, updateData } = req.body;

    const complainantCredentials = await complainantService.batchUpdateComplainantsById(
      complainantIds,
      updateData
    );

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainants updated successfully",
    });
  }

  @AsyncHandler()
  async softDeleteComplainant(req: Request, res: Response, next: NextFunction) {
    const { id: complainantId } = req.params;

    const complainantCredentials = await complainantService.softDeleteComplainant(
      complainantId as unknown as ObjectId
    );

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainant deleted successfully",
    });
  }

  @AsyncHandler()
  async hardDeleteComplainant(req: Request, res: Response, next: NextFunction) {
    const { complainantId } = req.params;
    const complainantCredentials = await complainantService.hardDeleteComplainant(
      complainantId as unknown as ObjectId
    );

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainant deleted successfully",
    });
  }

  @AsyncHandler()
  async batchSoftDeleteComplainants(req: Request, res: Response, next: NextFunction) {
    const { complainantIds } = req.body;
    const complainantCredentials = await complainantService.batchSoftDeleteComplainants(complainantIds);

    res.status(200).json({
      payload: complainantCredentials,
      message: "complainants soft deleted successfully",
    });
  }
}

export default new ComplainantController();
