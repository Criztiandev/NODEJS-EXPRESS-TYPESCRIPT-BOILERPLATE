
import { BaseController } from "../../../core/base/controller/base.controller";
import { OfficialsDocument } from "../interface/officials.interface";
import OfficialsService from "../service/officials.service";

class OfficialsController extends BaseController<OfficialsDocument> {
  protected service: typeof OfficialsService;

  constructor() {
    super(OfficialsService);
    this.service = OfficialsService;
  }
}

export default new OfficialsController();
