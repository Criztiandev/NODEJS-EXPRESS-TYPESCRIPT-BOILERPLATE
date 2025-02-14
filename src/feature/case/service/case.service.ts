
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { CaseDocument } from "../interface/case.interface";
import caseRepository from "../repository/case.repository";

class CaseService extends BaseService<CaseDocument> {
  constructor(caseRepository: BaseRepository<CaseDocument>) {
    super(caseRepository);
  }
}

export default new CaseService(caseRepository);
