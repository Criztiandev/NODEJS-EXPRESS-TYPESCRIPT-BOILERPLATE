import { CaseValidation } from "./../validation/case.validation";
import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../core/base/controller/base.controller";
import { AsyncHandler, ZodValidation } from "../../../utils/decorator.utils";
import { CaseDocument } from "../interface/case.interface";
import CaseService from "../service/case.service";
import { CaseWithParticipantsValidation } from "../validation/case-with-participants.validation";
import DocumentsService from "../../documents/service/documents.service";
import { ObjectId, Schema, Types } from "mongoose";
class CaseController extends BaseController<CaseDocument> {
  protected service: typeof CaseService;
  protected documentsService: typeof DocumentsService;

  constructor() {
    super(CaseService);
    this.service = CaseService;
    this.documentsService = DocumentsService;
  }

  protected getResourceName(): string {
    return "Case";
  }

  @AsyncHandler()
  @ZodValidation(CaseWithParticipantsValidation)
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const newCase = await this.service.createCase(req.body);

    const kpform7 = await this.documentsService.generateKpform7(
      newCase._id as ObjectId
    );

    // Notification for both account

    // Activity Log

    res.status(200).json({
      payload: {
        case: newCase,
        kpform7: kpform7,
      },
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
