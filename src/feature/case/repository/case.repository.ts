
import { CaseDocument } from "../interface/case.interface";
import caseModel from "../../../model/case.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class CaseRepository extends BaseRepository<CaseDocument> {
  constructor() {
    super(caseModel);
  }
}

export default new CaseRepository();
