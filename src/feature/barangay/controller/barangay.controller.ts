
import { BaseController } from "../../../core/base/controller/base.controller";
import { BarangayDocument } from "../interface/barangay.interface";
import BarangayService from "../service/barangay.service";

class BarangayController extends BaseController<BarangayDocument> {
  protected service: typeof BarangayService;

  constructor() {
    super(BarangayService);
    this.service = BarangayService;
  }
}

export default new BarangayController();
