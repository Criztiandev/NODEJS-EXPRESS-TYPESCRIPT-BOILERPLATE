import { Schema } from "mongoose";
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import CaseService from "../../case/service/case.service";
import { DocumentsDocument } from "../interface/documents.interface";
import documentsRepository from "../repository/documents.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { CaseWithParticipantsInput } from "../../case/validation/case-with-participants.validation";
import KPFormService from "./kpform.service";
class DocumentsService extends BaseService<DocumentsDocument> {
  protected readonly caseService: typeof CaseService;
  protected readonly kpFormService: typeof KPFormService;

  constructor(documentsRepository: BaseRepository<DocumentsDocument>) {
    super(documentsRepository);
    this.caseService = CaseService;
    this.kpFormService = KPFormService;
  }

  // methods from 1 to 25
  public async generateKpform1(caseId: Schema.Types.ObjectId) {}

  public async generateKpform2(caseId: string) {}

  public async generateKpform3(caseId: string) {}

  public async generateKpform4(caseId: string) {}

  public async generateKpform5(caseId: string) {}

  public async generateKpform6(caseId: string) {}

  public async generateKpform7(caseId: Schema.Types.ObjectId) {
    const existingCase: any = await this.caseService.getByIdService(caseId);

    if (!existingCase) {
      throw new BadRequestError("Case not found");
    }

    const complainant = existingCase.participants.complainants;
    const respondent = existingCase.participants.respondents;

    const complain = existingCase.disputeDetails?.description;

    // create a google form and send the form to the complainant and respondent
    const formUrl = await this.createGoogleForm(complain);

    return formUrl;
  }

  public async generateKpform8(caseId: string) {}

  public async generateKpform9(caseId: string) {}

  public async generateKpform10(caseId: string) {}

  public async generateKpform11(caseId: string) {}

  public async generateKpform12(caseId: string) {}

  public async generateKpform13(caseId: string) {}

  public async generateKpform14(caseId: string) {}

  public async generateKpform15(caseId: string) {}

  public async generateKpform16(caseId: string) {}

  public async generateKpform17(caseId: string) {}

  public async generateKpform18(caseId: string) {}

  public async generateKpform19(caseId: string) {}

  public async generateKpform20(caseId: string) {}

  public async generateKpform21(caseId: string) {}

  public async generateKpform22(caseId: string) {}

  public async generateKpform23(caseId: string) {}

  public async generateKpform24(caseId: string) {}

  public async generateKpform25(caseId: string) {}

  public async createGoogleForm(complain: string) {
    const formUrl = await this.kpFormService.createHelloWorldForm();

    return formUrl;
  }
}

export default new DocumentsService(documentsRepository);
