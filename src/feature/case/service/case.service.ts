import { ObjectId, Schema, Types } from "mongoose";
import { BaseService } from "../../../core/base/service/base.service";
import { BadRequestError } from "../../../utils/error.utils";
import {
  Case,
  CaseDocument,
  CaseWithParticipants,
} from "../interface/case.interface";
import CaseRepository from "../repository/case.repository";
import CaseparticipantsService from "../../case-participants/service/case-participants.service";

class CaseService extends BaseService<CaseDocument> {
  protected readonly repository: typeof CaseRepository;

  protected readonly caseParticipantsService: typeof CaseparticipantsService;
  constructor(repository: typeof CaseRepository) {
    super(repository);
    this.repository = repository;
    this.caseParticipantsService = CaseparticipantsService;
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

    // Instead of checking for exact participants match, check for cases with any of the same participants
    const complainantIds = participants.complainants;
    const respondentIds = participants.respondents;

    // Check if there are any cases with the same nature of dispute and participants
    const existingCaseParticipants =
      await this.caseParticipantsService.getAllByFiltersService({
        $or: [
          { "complainants.resident": { $in: complainantIds } },
          { "respondents.resident": { $in: respondentIds } },
        ],
      });

    if (existingCaseParticipants.length > 0) {
      const existingCase = await this.repository.findAll({
        natureOfDispute: caseData.natureOfDispute,
        $or: [
          { "disputeDetails.type": caseData.disputeDetails.type },
          {
            "disputeDetails.incidentDate": caseData.disputeDetails.incidentDate,
          },
          { "disputeDetails.location": caseData.disputeDetails.location },
        ],
        isDeleted: false,
      });

      if (existingCase.length > 0) {
        throw new BadRequestError("Case already exists");
      }
    }

    const newParticipants =
      await this.caseParticipantsService.createCaseParticipants({
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

  async getUserPaginatedCases(
    UID: Types.ObjectId,
    type: "respondent" | "complainant"
  ): Promise<Case[]> {
    const filterQuery = {
      [`${type}s.resident`]: UID,
    };

    const participants =
      await this.caseParticipantsService.getAllByFiltersService(filterQuery);

    const caseIds = participants.map((participant) => participant.case);

    const cases = await this.repository.findAll({
      _id: { $in: caseIds },
    });

    return cases;
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
