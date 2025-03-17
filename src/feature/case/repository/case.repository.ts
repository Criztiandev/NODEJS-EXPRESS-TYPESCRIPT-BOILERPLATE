import { CaseDocument } from "../interface/case.interface";
import caseModel from "../../../model/case.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class CaseRepository extends BaseRepository<CaseDocument> {
  constructor() {
    super(caseModel);
  }

  public async getTotalCasesCount(): Promise<number> {
    return this.model.countDocuments();
  }

  public async getTotalCasesCountByStatus(status: string): Promise<number> {
    return this.model.countDocuments({ status });
  }

  public async getTotalCasesCountByBarangay(
    barangayId: string
  ): Promise<number> {
    return this.model.countDocuments({ barangay: barangayId });
  }
}

export default new CaseRepository();
