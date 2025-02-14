
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { BarangayDocument } from "../interface/barangay.interface";
import barangayRepository from "../repository/barangay.repository";

class BarangayService extends BaseService<BarangayDocument> {
  constructor(barangayRepository: BaseRepository<BarangayDocument>) {
    super(barangayRepository);
  }
}

export default new BarangayService(barangayRepository);
