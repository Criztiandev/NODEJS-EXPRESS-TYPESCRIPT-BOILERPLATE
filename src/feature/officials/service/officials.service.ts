
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { OfficialsDocument } from "../interface/officials.interface";
import officialsRepository from "../repository/officials.repository";

class OfficialsService extends BaseService<OfficialsDocument> {
  constructor(officialsRepository: BaseRepository<OfficialsDocument>) {
    super(officialsRepository);
  }
}

export default new OfficialsService(officialsRepository);
