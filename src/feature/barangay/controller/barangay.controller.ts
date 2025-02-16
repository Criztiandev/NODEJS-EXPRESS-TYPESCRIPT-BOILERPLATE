import { Request, Response, NextFunction } from "express";
import { BaseController } from "../../../core/base/controller/base.controller";
import { AsyncHandler, ZodValidation } from "../../../utils/decorator.utils";
import { BarangayDocument } from "../interface/barangay.interface";
import BarangayService from "../service/barangay.service";
import { BarangayValidation } from "../validation/barangay.validation";
import { ProtectedController } from "../../../decorator/routes/protected-routes.decorator";
import { BadRequestError } from "../../../utils/error.utils";

@ProtectedController()
class BarangayController extends BaseController<BarangayDocument> {
  protected service: typeof BarangayService;

  constructor() {
    super(BarangayService);
    this.service = BarangayService;
  }

  protected getResourceName(): string {
    return "Barangay";
  }

  @AsyncHandler()
  @ZodValidation(BarangayValidation)
  override async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const newBarangay = await this.service.createBarangay(
      req.session.user?._id,
      req.body
    );

    res.status(200).json({
      payload: {
        _id: newBarangay._id,
        name: newBarangay.name,
        municipality: newBarangay.municipality,
        province: newBarangay.province,
      },
      message: "Barangay created successfully",
    });
  }

  @AsyncHandler()
  override async getAll(req: Request, res: Response, next: NextFunction) {
    const queryParams = req.query;
    const items = await this.service.getPaginatedItems(queryParams, {
      searchableFields: [
        "name",
        "municipality",
        "province",
        "contactInfo.phone",
        "contactInfo.email",
        "contactInfo.emergencyContact",
      ],
    });

    res.status(200).json({
      payload: items,
      message: "Barangays retrieved successfully",
    });
  }

  @AsyncHandler()
  override async getDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const item = await this.service.getItem(
      id,
      "-isDeleted -deletedAt -updatedAt"
    );

    res.status(200).json({
      payload: item,
      message: "Barangay retrieved successfully",
    });
  }

  @AsyncHandler()
  override async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id: barangayId } = req.params;

    const updatedBarangay = await this.service.updateBarangay(
      req.session.user?._id,
      barangayId,
      req.body
    );

    res.status(200).json({
      payload: updatedBarangay,
      message: "Barangay updated successfully",
    });
  }
}

export default new BarangayController();
