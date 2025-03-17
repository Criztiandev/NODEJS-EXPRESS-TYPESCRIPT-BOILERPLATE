
import { HearingDocument } from "../interface/hearing.interface";
import hearingModel from "../../../model/hearing.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class HearingRepository extends BaseRepository<HearingDocument> {
  constructor() {
    super(hearingModel);
  }
}

export default new HearingRepository();
