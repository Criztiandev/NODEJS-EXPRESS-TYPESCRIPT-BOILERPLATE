import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { CasepartyDocument } from "../interface/case-party.interface";
import casepartyRepository from "../repository/case-party.repository";

class CasepartyService extends BaseService<CasepartyDocument> {
  constructor(casepartyRepository: BaseRepository<CasepartyDocument>) {
    super(casepartyRepository);
  }
}

export default new CasepartyService(casepartyRepository);
