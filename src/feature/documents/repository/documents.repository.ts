
import { DocumentsDocument } from "../interface/documents.interface";
import documentsModel from "../../../model/documents.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class DocumentsRepository extends BaseRepository<DocumentsDocument> {
  constructor() {
    super(documentsModel);
  }
}

export default new DocumentsRepository();
