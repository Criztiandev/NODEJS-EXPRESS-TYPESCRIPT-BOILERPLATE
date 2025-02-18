import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../core/base/controller/base.controller";
import { ZodValidation, AsyncHandler } from "../../../utils/decorator.utils";
import { HearingDocument } from "../interface/hearing.interface";
import HearingService from "../service/hearing.service";
import { HearingValidation } from "../validation/hearing.validation";

class HearingController extends BaseController<HearingDocument> {
  protected service: typeof HearingService;

  constructor() {
    super(HearingService);
    this.service = HearingService;
  }

  @AsyncHandler()
  @ZodValidation(HearingValidation)
  override async create(req: Request, res: Response, next: NextFunction) {
    const newHearing = await this.service.createHearing(req.body);

    res.status(200).json({
      payload: newHearing,
      message: `${this.getResourceName()} created successfully`,
    });
  }

  @AsyncHandler()
  @ZodValidation(HearingValidation, { isPartial: true })
  override async update(req: Request, res: Response, next: NextFunction) {
    const updatedHearing = await this.service.updateService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      payload: updatedHearing,
      message: `${this.getResourceName()} updated successfully`,
    });
  }
}

export default new HearingController();
