
import { OfficialsDocument } from "../interface/officials.interface";
import officialsModel from "../../../model/officials.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class OfficialsRepository extends BaseRepository<OfficialsDocument> {
  constructor() {
    super(officialsModel);
  }
}

export default new OfficialsRepository();
