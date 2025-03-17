
import { SettlementDocument } from "../interface/settlement.interface";
import settlementModel from "../../../model/settlement.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class SettlementRepository extends BaseRepository<SettlementDocument> {
  constructor() {
    super(settlementModel);
  }
}

export default new SettlementRepository();
