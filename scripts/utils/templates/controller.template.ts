export const controllerTemplate = `
import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import caseService from "../service/case.service";
import { FilterQuery, ObjectId } from "mongoose";
import { Case } from "../../../model/case.model";

class CaseController {
  @AsyncHandler()
  async getCase(req: Request, res: Response, next: NextFunction) {
    const { caseId } = req.params;

    const caseCredentials = await caseService.getCase(caseId);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case retrieved successfully",
    });
  }

  @AsyncHandler()
  async getCaseByFilters(req: Request, res: Response, next: NextFunction) {
    const { filters } = req.query as { filters: FilterQuery<Case> };

    const caseCredentials = await caseService.getCaseByFilters(filters);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllCases(req: Request, res: Response, next: NextFunction) {
    const { page, limit, filters } = req.query;

    const caseCredentials = await caseService.getPaginatedCases(
      filters as FilterQuery<Case>,
      undefined, // select parameter
      Number(page),
      Number(limit)
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
  async updateCase(req: Request, res: Response, next: NextFunction) {
    const { caseId } = req.params;
    const caseCredentials = await caseService.updateCase(caseId, req.body);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdateCases(req: Request, res: Response, next: NextFunction) {
    const { caseIds, updateData } = req.body;

    const caseCredentials = await caseService.batchUpdateCases(
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
    const { caseId } = req.params;
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

  @AsyncHandler()
  async batchHardDeleteCases(req: Request, res: Response, next: NextFunction) {
    const { caseIds } = req.body;
    const caseCredentials = await caseService.batchHardDeleteCases(caseIds);

    res.status(200).json({
      payload: caseCredentials,
      message: "Cases hard deleted successfully",
    });
  }
}

export default new CaseController();
`;
