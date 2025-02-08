import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import caseService from "../service/case.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";

class CaseController {
  @AsyncHandler()
  async getCaseDetails(req: Request, res: Response, next: NextFunction) {
    const { id: caseId } = req.params;

    const caseCredentials = await caseService.getCase(caseId);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case retrieved successfully",
    });
  }

  @AsyncHandler()
  async getSoftDeletedCaseDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: caseId } = req.params;

    const caseCredentials = await caseService.getSoftDeletedCase(caseId);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case retrieved successfully",
    });
  }

  /**
   * Get all cases with pagination
   * /api/cases?search=urgent&status=open&priority=high
   * /api/cases?page=1&limit=10
   */
  @AsyncHandler()
  async getAllCases(req: Request, res: Response, next: NextFunction) {
    const queryParams: QueryParams = req.query as QueryParams;

    const caseCredentials = await caseService.getPaginatedCases(queryParams);

    res.status(200).json({
      payload: caseCredentials,
      message: "Cases retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllSoftDeletedCases(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const caseCredentials = await caseService.getPaginatedSoftDeletedCases(
      queryParams
    );

    res.status(200).json({
      payload: caseCredentials,
      message: "Cases retrieved successfully",
    });
  }

  @AsyncHandler()
  async createCase(req: Request, res: Response, next: NextFunction) {
    const caseCredentials = await caseService.createCase(req.body);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case created successfully",
    });
  }

  @AsyncHandler()
  async restoreSoftDeletedCase(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: caseId } = req.params;
    const caseCredentials = await caseService.restoreSoftDeletedCase(caseId);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case restored successfully",
    });
  }

  @AsyncHandler()
  async updateCase(req: Request, res: Response, next: NextFunction) {
    const { id: caseId } = req.params;
    const caseCredentials = await caseService.updateCase(caseId, req.body);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdateCases(req: Request, res: Response, next: NextFunction) {
    const { caseIds, updateData } = req.body;

    const caseCredentials = await caseService.batchUpdateCasesById(
      caseIds,
      updateData
    );

    res.status(200).json({
      payload: caseCredentials,
      message: "Cases updated successfully",
    });
  }

  @AsyncHandler()
  async softDeleteCase(req: Request, res: Response, next: NextFunction) {
    const { id: caseId } = req.params;

    const caseCredentials = await caseService.softDeleteCase(
      caseId as unknown as ObjectId
    );

    res.status(200).json({
      payload: caseCredentials,
      message: "Case deleted successfully",
    });
  }

  @AsyncHandler()
  async hardDeleteCase(req: Request, res: Response, next: NextFunction) {
    const { caseId } = req.params;
    const caseCredentials = await caseService.hardDeleteCase(
      caseId as unknown as ObjectId
    );

    res.status(200).json({
      payload: caseCredentials,
      message: "Case deleted successfully",
    });
  }

  @AsyncHandler()
  async batchSoftDeleteCases(req: Request, res: Response, next: NextFunction) {
    const { caseIds } = req.body;
    const caseCredentials = await caseService.batchSoftDeleteCases(caseIds);

    res.status(200).json({
      payload: caseCredentials,
      message: "Cases soft deleted successfully",
    });
  }
}

export default new CaseController();
