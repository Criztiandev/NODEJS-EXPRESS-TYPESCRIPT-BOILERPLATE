
import { AuditDocument } from "../interface/audit.interface";
import auditModel from "../../../model/audit.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class AuditRepository extends BaseRepository<AuditDocument> {
  constructor() {
    super(auditModel);
  }
}

export default new AuditRepository();
