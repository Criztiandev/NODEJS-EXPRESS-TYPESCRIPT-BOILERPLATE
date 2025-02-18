import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import { Document } from "mongoose";
import { BaseService } from "../service/base.service";
import { SoftDeleteFields } from "../repository/base.repository";
import { BadRequestError } from "../../../utils/error.utils";

export abstract class BaseController<T extends Document & SoftDeleteFields> {
  constructor(protected readonly service: BaseService<T>) {
    if (!service) {
      throw new Error("Service is required for BaseController");
    }
  }

  // Define the domain-specific method names that will be used in routes
  @AsyncHandler()
  async getDetails(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const item = await this.service.getByIdService(id);

    if (!item) {
      throw new BadRequestError(`${this.getResourceName()} not found`);
    }

    res.status(200).json({
      payload: item,
      message: `${this.getResourceName()} retrieved successfully`,
    });
  }

  @AsyncHandler()
  async getSoftDeletedDetails(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const item = await this.service.getSoftDeletedByIdService(id);

    res.status(200).json({
      payload: item,
      message: `Deleted ${this.getResourceName()} retrieved successfully`,
    });
  }

  @AsyncHandler()
  async getAll(req: Request, res: Response, next: NextFunction) {
    const queryParams = req.query;
    const items = await this.service.getPaginatedService(queryParams, {
      defaultFilters: { isDeleted: false },
    });

    res.status(200).json({
      payload: items,
      message: `${this.getResourceName()}s retrieved successfully`,
    });
  }

  @AsyncHandler()
  async getAllSoftDeleted(req: Request, res: Response, next: NextFunction) {
    const queryParams = req.query;
    const items = await this.service.getPaginatedService(queryParams, {
      defaultFilters: { isDeleted: true },
    });

    res.status(200).json({
      payload: items,
      message: `Deleted ${this.getResourceName()}s retrieved successfully`,
    });
  }

  @AsyncHandler()
  async create(req: Request, res: Response, next: NextFunction) {
    const item = await this.service.createService(req.body);

    res.status(201).json({
      payload: item,
      message: `${this.getResourceName()} created successfully`,
    });
  }

  @AsyncHandler()
  async restoreSoftDeleted(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const item = await this.service.restoreService(id);

    res.status(200).json({
      payload: item,
      message: `${this.getResourceName()} restored successfully`,
    });
  }

  @AsyncHandler()
  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const item = await this.service.updateService(id, req.body);

    res.status(200).json({
      payload: item,
      message: `${this.getResourceName()} updated successfully`,
    });
  }

  @AsyncHandler()
  async softDelete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const item = await this.service.softDeleteService(id);

    res.status(200).json({
      payload: item,
      message: `${this.getResourceName()} deleted successfully`,
    });
  }

  @AsyncHandler()
  async hardDelete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const item = await this.service.hardDeleteService(id);

    res.status(200).json({
      payload: item,
      message: `${this.getResourceName()} permanently deleted successfully`,
    });
  }

  // Helper method to get resource name - can be overridden by specific controllers
  protected getResourceName(): string {
    return "Resource";
  }
}
