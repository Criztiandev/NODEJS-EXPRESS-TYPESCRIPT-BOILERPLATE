
import { BaseController } from "../../../core/base/controller/base.controller";
import { HearingDocument } from "../interface/hearing.interface";
import HearingService from "../service/hearing.service";

class HearingController extends BaseController<HearingDocument> {
  protected service: typeof HearingService;

  constructor() {
    super(HearingService);
    this.service = HearingService;
  }
}

export default new HearingController();
