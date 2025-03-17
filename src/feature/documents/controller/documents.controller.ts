import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../core/base/controller/base.controller";
import { AsyncHandler } from "../../../utils/decorator.utils";
import { DocumentsDocument } from "../interface/documents.interface";
import DocumentsService from "../service/documents.service";

class DocumentsController extends BaseController<DocumentsDocument> {
  protected service: typeof DocumentsService;

  constructor() {
    super(DocumentsService);
    this.service = DocumentsService;
  }

  @AsyncHandler()
  async createCaseDocument(req: Request, res: Response, next: NextFunction) {
    const { caseId } = req.params;
    const { type, fileName, fileUrl } = req.body;
    // const document = await this.service.createCaseDocument(
    //   caseId,
    //   type,
    //   fileName,
    //   fileUrl
    // );
    res.status(200).json({ message: "Document created successfully" });
  }
}

export default new DocumentsController();
