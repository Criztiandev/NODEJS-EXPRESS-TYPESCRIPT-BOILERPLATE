import { Request, Response } from "express";
import { BaseController } from "../../../core/base/controller/base.controller";
import { AsyncHandler } from "../../../utils/decorator.utils";
import { OfficialsDocument } from "../interface/officials.interface";
import OfficialsService from "../service/officials.service";

class OfficialsController extends BaseController<OfficialsDocument> {
  protected service: typeof OfficialsService;

  constructor() {
    super(OfficialsService);
    this.service = OfficialsService;
  }

  @AsyncHandler()
  override async create(req: Request, res: Response) {
    const newOfficials = await this.service.createOfficial(req.body);

    res.status(200).json({
      payload: newOfficials,
      message: "Official created successfully",
    });
  }
}

export default new OfficialsController();
