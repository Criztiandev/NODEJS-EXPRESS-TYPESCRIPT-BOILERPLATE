import { ObjectId, Types } from "mongoose";
import { BaseService } from "../../../core/base/service/base.service";
import { BadRequestError } from "../../../utils/error.utils";
import caseParticipantsService from "../../case-participants/service/case-participants.service";
import {
  CaseDocument,
  CaseWithParticipants,
} from "../interface/case.interface";
import CaseRepository from "../repository/case.repository";
import userService from "../../user/service/user.service";

class CaseService extends BaseService<CaseDocument> {
  protected readonly repository: typeof CaseRepository;
  constructor(repository: typeof CaseRepository) {
    super(repository);
    this.repository = repository;
  }

  /**
   * Create a new case
   * @param userId - The user ID of the creator
   * @param payload - The case data to create
   * @returns The created case document
   */

  async createCase(payload: CaseWithParticipants): Promise<CaseDocument> {
    const caseNumber = await this.generateCaseNumber();

    const { participants, ...caseData } = payload;

    const newCaseId = new Types.ObjectId();
    console.log(newCaseId);

    const newParticipants =
      await caseParticipantsService.createCaseParticipants({
        case: newCaseId,
        participants,
      });

    const newCase = await this.repository.create({
      ...caseData,
      caseNumber,
      participants: newParticipants._id as ObjectId,
    });

    if (!newCase) {
      throw new BadRequestError("Failed to create case");
    }

    return newCase;
  }

  // Helper function to generate case number
  private async generateCaseNumber(): Promise<string> {
    const totalCases = await this.repository.getTotalCasesCount();

    const caseNumber = `CASE-${totalCases + 1}`;
    const caseNumberWithLetter = `CASE-${totalCases + 1}${String.fromCharCode(
      65 + totalCases
    )}`;

    if (totalCases > 9999) {
      return caseNumberWithLetter;
    }

    return caseNumber;
  }
}

export default new CaseService(CaseRepository);
