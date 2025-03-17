
import { BaseController } from "../../../core/base/controller/base.controller";
import { AuditDocument } from "../interface/audit.interface";
import AuditService from "../service/audit.service";

class AuditController extends BaseController<AuditDocument> {
  protected service: typeof AuditService;

  constructor() {
    super(AuditService);
    this.service = AuditService;
  }
}

export default new AuditController();
