
import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import mediatorService from "../service/mediator.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";


class MediatorController {
  @AsyncHandler()
  async getMediatorDetails(req: Request, res: Response, next: NextFunction) {

    const { id: mediatorId } = req.params;


    const mediatorCredentials = await mediatorService.getMediator(mediatorId);

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediator retrieved successfully",
    });
  }

  @AsyncHandler()
  async getSoftDeletedMediatorDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: mediatorId } = req.params;

    const mediatorCredentials = await mediatorService.getSoftDeletedMediator(mediatorId);

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediator retrieved successfully",
    });
  }

  /**
   * Get all mediators with pagination
   * /api/mediators?search=urgent&status=open&priority=high
   * /api/mediators?page=1&limit=10
   */
  @AsyncHandler()
  async getAllMediators(req: Request, res: Response, next: NextFunction) {
    const queryParams: QueryParams = req.query as QueryParams;

    const mediatorCredentials = await mediatorService.getPaginatedMediators(queryParams);

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediators retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllSoftDeletedMediators(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const mediatorCredentials = await mediatorService.getPaginatedSoftDeletedMediators(
      queryParams
    );


    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediators retrieved successfully",
    });
  }

  @AsyncHandler()
  async createMediator(req: Request, res: Response, next: NextFunction) {
    const mediatorCredentials = await mediatorService.createMediator(req.body);

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediator created successfully",
    });
  }

  @AsyncHandler()
  async restoreSoftDeletedMediator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: mediatorId } = req.params;
    const mediatorCredentials = await mediatorService.restoreSoftDeletedMediator(mediatorId);

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediator restored successfully",
    });
  }

  @AsyncHandler()
  async updateMediator(req: Request, res: Response, next: NextFunction) {
    const { id: mediatorId } = req.params;
    const mediatorCredentials = await mediatorService.updateMediator(mediatorId, req.body);

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediator updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdateMediators(req: Request, res: Response, next: NextFunction) {
    const { mediatorIds, updateData } = req.body;

    const mediatorCredentials = await mediatorService.batchUpdateMediatorsById(
      mediatorIds,
      updateData
    );

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediators updated successfully",
    });
  }

  @AsyncHandler()
  async softDeleteMediator(req: Request, res: Response, next: NextFunction) {
    const { id: mediatorId } = req.params;

    const mediatorCredentials = await mediatorService.softDeleteMediator(
      mediatorId as unknown as ObjectId
    );

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediator deleted successfully",
    });
  }

  @AsyncHandler()
  async hardDeleteMediator(req: Request, res: Response, next: NextFunction) {
    const { mediatorId } = req.params;
    const mediatorCredentials = await mediatorService.hardDeleteMediator(
      mediatorId as unknown as ObjectId
    );

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediator deleted successfully",
    });
  }

  @AsyncHandler()
  async batchSoftDeleteMediators(req: Request, res: Response, next: NextFunction) {
    const { mediatorIds } = req.body;
    const mediatorCredentials = await mediatorService.batchSoftDeleteMediators(mediatorIds);

    res.status(200).json({
      payload: mediatorCredentials,
      message: "mediators soft deleted successfully",
    });
  }
}

export default new MediatorController();
