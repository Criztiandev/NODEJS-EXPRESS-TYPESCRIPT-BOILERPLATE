import { NextFunction, Request, Response } from "express";
import { AllowedRoles, AsyncHandler } from "../../../utils/decorator.utils";
import caseService from "../service/case.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";
import { ProtectedController } from "../../../decorator/routes/protected-routes.decorator";

@ProtectedController()
class CaseController {
  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
  async getCaseDetails(req: Request, res: Response, next: NextFunction) {
    const { id: caseId } = req.params;

    const caseCredentials = await caseService.getCase(caseId);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case retrieved successfully",
    });
  }

  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
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
  @AllowedRoles(["admin", "user"])
  async getAllCases(req: Request, res: Response, next: NextFunction) {
    const queryParams: QueryParams = req.query as QueryParams;

    const caseCredentials = await caseService.getPaginatedCases(queryParams);

    res.status(200).json({
      payload: caseCredentials,
      message: "Cases retrieved successfully",
    });
  }

  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
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
  @AllowedRoles(["user", "admin"])
  async createCase(req: Request, res: Response, next: NextFunction) {
    const caseCredentials = await caseService.createCase(req.body);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case created successfully",
    });
  }

  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
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
  @AllowedRoles(["user", "admin"])
  async updateCase(req: Request, res: Response, next: NextFunction) {
    const { id: caseId } = req.params;
    const caseCredentials = await caseService.updateCase(caseId, req.body);

    res.status(200).json({
      payload: caseCredentials,
      message: "Case updated successfully",
    });
  }

  @AsyncHandler()
  @AllowedRoles(["user", "admin"])
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
  @AllowedRoles(["user", "admin"])
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
  @AllowedRoles(["user", "admin"])
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
  @AllowedRoles(["user", "admin"])
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
