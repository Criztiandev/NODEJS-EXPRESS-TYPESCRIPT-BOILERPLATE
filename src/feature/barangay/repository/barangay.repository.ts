
import { BarangayDocument } from "../interface/barangay.interface";
import barangayModel from "../../../model/barangay.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class BarangayRepository extends BaseRepository<BarangayDocument> {
  constructor() {
    super(barangayModel);
  }
}

export default new BarangayRepository();
