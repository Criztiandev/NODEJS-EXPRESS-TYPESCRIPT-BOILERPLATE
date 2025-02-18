import { CaseValidation } from "./../validation/case.validation";
import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../core/base/controller/base.controller";
import { AsyncHandler, ZodValidation } from "../../../utils/decorator.utils";
import { CaseDocument } from "../interface/case.interface";
import CaseService from "../service/case.service";

class CaseController extends BaseController<CaseDocument> {
  protected service: typeof CaseService;

  constructor() {
    super(CaseService);
    this.service = CaseService;
  }

  protected getResourceName(): string {
    return "Case";
  }

  @AsyncHandler()
  @ZodValidation(CaseValidation)
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const newCase = await this.service.createCase(req.body);

    res.status(200).json({
      payload: newCase,
      message: `${this.getResourceName()} created successfully`,
    });
  }

  @AsyncHandler()
  @ZodValidation(CaseValidation, { isPartial: true })
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const updatedCase = await this.service.updateService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      payload: updatedCase,
      message: `${this.getResourceName()} updated successfully`,
    });
  }
}

export default new CaseController();
