import { CasepartyDocument } from "../interface/case-party.interface";
import casepartyModel from "../../../model/case-party.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class CasepartyRepository extends BaseRepository<CasepartyDocument> {
  constructor() {
    super(casepartyModel);
  }
}

export default new CasepartyRepository();
