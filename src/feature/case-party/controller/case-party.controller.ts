import { BaseController } from "../../../core/base/controller/base.controller";
import { CasepartyDocument } from "../interface/case-party.interface";
import CasepartyService from "../service/case-party.service";

class CasepartyController extends BaseController<CasepartyDocument> {
  protected service: typeof CasepartyService;

  constructor() {
    super(CasepartyService);
    this.service = CasepartyService;
  }
}

export default new CasepartyController();
