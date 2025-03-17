
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { AuditDocument } from "../interface/audit.interface";
import auditRepository from "../repository/audit.repository";

class AuditService extends BaseService<AuditDocument> {
  constructor(auditRepository: BaseRepository<AuditDocument>) {
    super(auditRepository);
  }
}

export default new AuditService(auditRepository);
