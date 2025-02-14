
import { BaseController } from "../../../core/base/controller/base.controller";
import { CaseDocument } from "../interface/case.interface";
import CaseService from "../service/case.service";

class CaseController extends BaseController<CaseDocument> {
  protected service: typeof CaseService;

  constructor() {
    super(CaseService);
    this.service = CaseService;
  }
}

export default new CaseController();
