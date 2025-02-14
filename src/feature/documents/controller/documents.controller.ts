
import { BaseController } from "../../../core/base/controller/base.controller";
import { DocumentsDocument } from "../interface/documents.interface";
import DocumentsService from "../service/documents.service";

class DocumentsController extends BaseController<DocumentsDocument> {
  protected service: typeof DocumentsService;

  constructor() {
    super(DocumentsService);
    this.service = DocumentsService;
  }
}

export default new DocumentsController();
