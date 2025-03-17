
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { SettlementDocument } from "../interface/settlement.interface";
import settlementRepository from "../repository/settlement.repository";

class SettlementService extends BaseService<SettlementDocument> {
  constructor(settlementRepository: BaseRepository<SettlementDocument>) {
    super(settlementRepository);
  }
}

export default new SettlementService(settlementRepository);
