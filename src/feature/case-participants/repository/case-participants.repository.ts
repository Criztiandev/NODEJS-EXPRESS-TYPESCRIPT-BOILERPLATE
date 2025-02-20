import { BaseRepository } from "../../../core/base/repository/base.repository";
import { CaseParticipantsDocument } from "../interface/case-participants.interface";
import caseParticipantsModel from "../../../model/case-participants.model";

class CaseParticipantsRepository extends BaseRepository<CaseParticipantsDocument> {
  constructor() {
    super(caseParticipantsModel);
  }
}

export default new CaseParticipantsRepository();
