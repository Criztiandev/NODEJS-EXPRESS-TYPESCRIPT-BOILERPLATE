import { BaseController } from "../../../core/base/controller/base.controller";
import CaseParticipantsService from "../service/case-participants.service";
import { CaseParticipantsDocument } from "../interface/case-participants.interface";

class CaseParticipantsController extends BaseController<CaseParticipantsDocument> {
  protected service: typeof CaseParticipantsService;

  constructor() {
    super(CaseParticipantsService);
    this.service = CaseParticipantsService;
  }
}

export default new CaseParticipantsController();
