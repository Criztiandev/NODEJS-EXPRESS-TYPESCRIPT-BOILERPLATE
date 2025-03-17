
import { BaseController } from "../../../core/base/controller/base.controller";
import { SettlementDocument } from "../interface/settlement.interface";
import SettlementService from "../service/settlement.service";

class SettlementController extends BaseController<SettlementDocument> {
  protected service: typeof SettlementService;

  constructor() {
    super(SettlementService);
    this.service = SettlementService;
  }
}

export default new SettlementController();
