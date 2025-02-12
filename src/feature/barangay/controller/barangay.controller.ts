
import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import barangayService from "../service/barangay.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";


class BarangayController {
  @AsyncHandler()
  async getBarangayDetails(req: Request, res: Response, next: NextFunction) {

    const { id: barangayId } = req.params;


    const barangayCredentials = await barangayService.getBarangay(barangayId);

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangay retrieved successfully",
    });
  }

  @AsyncHandler()
  async getSoftDeletedBarangayDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: barangayId } = req.params;

    const barangayCredentials = await barangayService.getSoftDeletedBarangay(barangayId);

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangay retrieved successfully",
    });
  }

  /**
   * Get all barangays with pagination
   * /api/barangays?search=urgent&status=open&priority=high
   * /api/barangays?page=1&limit=10
   */
  @AsyncHandler()
  async getAllBarangays(req: Request, res: Response, next: NextFunction) {
    const queryParams: QueryParams = req.query as QueryParams;

    const barangayCredentials = await barangayService.getPaginatedBarangays(queryParams);

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangays retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllSoftDeletedBarangays(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const barangayCredentials = await barangayService.getPaginatedSoftDeletedBarangays(
      queryParams
    );


    res.status(200).json({
      payload: barangayCredentials,
      message: "barangays retrieved successfully",
    });
  }

  @AsyncHandler()
  async createBarangay(req: Request, res: Response, next: NextFunction) {
    const barangayCredentials = await barangayService.createBarangay(req.body);

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangay created successfully",
    });
  }

  @AsyncHandler()
  async restoreSoftDeletedBarangay(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: barangayId } = req.params;
    const barangayCredentials = await barangayService.restoreSoftDeletedBarangay(barangayId);

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangay restored successfully",
    });
  }

  @AsyncHandler()
  async updateBarangay(req: Request, res: Response, next: NextFunction) {
    const { id: barangayId } = req.params;
    const barangayCredentials = await barangayService.updateBarangay(barangayId, req.body);

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangay updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdateBarangays(req: Request, res: Response, next: NextFunction) {
    const { barangayIds, updateData } = req.body;

    const barangayCredentials = await barangayService.batchUpdateBarangaysById(
      barangayIds,
      updateData
    );

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangays updated successfully",
    });
  }

  @AsyncHandler()
  async softDeleteBarangay(req: Request, res: Response, next: NextFunction) {
    const { id: barangayId } = req.params;

    const barangayCredentials = await barangayService.softDeleteBarangay(
      barangayId as unknown as ObjectId
    );

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangay deleted successfully",
    });
  }

  @AsyncHandler()
  async hardDeleteBarangay(req: Request, res: Response, next: NextFunction) {
    const { barangayId } = req.params;
    const barangayCredentials = await barangayService.hardDeleteBarangay(
      barangayId as unknown as ObjectId
    );

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangay deleted successfully",
    });
  }

  @AsyncHandler()
  async batchSoftDeleteBarangays(req: Request, res: Response, next: NextFunction) {
    const { barangayIds } = req.body;
    const barangayCredentials = await barangayService.batchSoftDeleteBarangays(barangayIds);

    res.status(200).json({
      payload: barangayCredentials,
      message: "barangays soft deleted successfully",
    });
  }
}

export default new BarangayController();
