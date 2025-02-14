
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { HearingDocument } from "../interface/hearing.interface";
import hearingRepository from "../repository/hearing.repository";

class HearingService extends BaseService<HearingDocument> {
  constructor(hearingRepository: BaseRepository<HearingDocument>) {
    super(hearingRepository);
  }
}

export default new HearingService(hearingRepository);
