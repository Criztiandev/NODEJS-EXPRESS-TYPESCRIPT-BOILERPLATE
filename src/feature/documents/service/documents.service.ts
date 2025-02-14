
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { DocumentsDocument } from "../interface/documents.interface";
import documentsRepository from "../repository/documents.repository";

class DocumentsService extends BaseService<DocumentsDocument> {
  constructor(documentsRepository: BaseRepository<DocumentsDocument>) {
    super(documentsRepository);
  }
}

export default new DocumentsService(documentsRepository);
