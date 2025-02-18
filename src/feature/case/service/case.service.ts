import { ObjectId } from "mongoose";
import { BaseService } from "../../../core/base/service/base.service";
import { BadRequestError } from "../../../utils/error.utils";
import notificationService from "../../notification/service/notification.service";
import { CaseDocument } from "../interface/case.interface";
import CaseRepository from "../repository/case.repository";
import auditService from "../../audit/service/audit.service";
import accountService from "../../account/service/account.service";
import userService from "../../user/service/user.service";
import userRepository from "../../user/repository/user.repository";

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

  async createCase(payload: Partial<CaseDocument>): Promise<CaseDocument> {
    const caseNumber = await this.generateCaseNumber();

    // check if the complainants is exist
    const existingUsers = await userRepository.findAll({
      _id: { $in: payload.complainants?.residents },
    });

    if (existingUsers.length !== payload.complainants?.residents.length) {
      throw new BadRequestError("Complainants not found");
    }

    // check if the respondents is exist
    const existingRespondents = await userRepository.findAll({
      _id: { $in: payload.respondents?.residents },
    });

    if (existingRespondents.length !== payload.respondents?.residents.length) {
      throw new BadRequestError("Respondents not found");
    }

    // check if the witnesses is exist
    if (payload.witnesses) {
      const existingWitnesses = await userRepository.findAll({
        _id: { $in: payload.witnesses?.residents },
      });

      if (existingWitnesses.length !== payload.witnesses?.residents.length) {
        throw new BadRequestError("Witnesses not found");
      }
    }

    // check if there is a case with the same complainants and respondents
    const query = {
      $and: [
        {
          natureOfDispute: payload.natureOfDispute,
          complainants: {
            $elemMatch: {
              residents: { $in: payload.complainants.residents },
            },
          },
        },
        {
          respondents: {
            $elemMatch: {
              residents: { $in: payload.respondents.residents },
            },
          },
        },
      ],
    };

    await this.validateAlreadyExistsByFilters(query, {
      errorMessage: "Case already exists",
    });

    const caseData = {
      ...payload,
      caseNumber,
    };

    const newCase = await this.repository.create(caseData);

    if (!newCase) {
      throw new BadRequestError("Failed to create case");
    }

    return newCase;
  }

  /**
   * Update a case
   * @param userId - The user ID of the updater
   * @param caseId - The ID of the case to update
   * @param payload - The case data to update
   * @returns The updated case document
   */
  async updateCase(
    caseId: string,
    payload: Partial<CaseDocument>
  ): Promise<CaseDocument> {
    const existingCase = await this.validateExists(caseId);

    if (!existingCase) {
      throw new BadRequestError("Case not found");
    }

    const updatedCase = await this.updateService(caseId, payload, {
      select: "_id",
    });

    if (!updatedCase) {
      throw new BadRequestError("Failed to update case");
    }

    return updatedCase;
  }

  /**
   * Escalate a case, this will move the case to the next step
   * @param caseId - The ID of the case to escalate
   * @param payload - The case data to escalate
   */
  async escalateCase(caseId: string, payload: Partial<CaseDocument>) {
    const existingCase = await this.validateExists(caseId);

    if (!existingCase) {
      throw new BadRequestError("Case not found");
    }

    const updatedCase = await this.updateService(caseId, payload, {
      select: "_id",
    });

    if (!updatedCase) {
      throw new BadRequestError("Failed to escalate case");
    }

    return updatedCase;
  }

  async resolveCaseWithSettlement(
    userId: ObjectId,
    caseId: string,
    payload: Partial<CaseDocument>
  ) {
    // Check if the case exists
    const existingCase = await this.validateExists(caseId, {
      errorMessage: "Case not found",
    });

    // check if the case status is under mediation
    if (
      existingCase.status !== "under_mediation" ||
      existingCase.resolution.type !== "escalated"
    ) {
      throw new BadRequestError("Case is not under mediation");
    }

    const account = await accountService.validateExists(userId, {
      select: "_id",
    });

    if (!account) {
      throw new BadRequestError("User not found");
    }

    // Update the case with settlement details
    const updatedCase = await this.updateService(
      caseId,
      {
        ...payload,
        status: "resolved",
        resolution: {
          ...existingCase.resolution,
          type: "settled",
          date: new Date(),
          details: payload.resolution?.details,
          attachments: payload.resolution?.attachments,
        },
      },
      {
        select: "_id",
        errorMessage: "Failed to resolve case with settlement",
      }
    );

    return updatedCase;
  }

  /**
   * Check and Escalate Case, this will check if the case is pending for 15 days and escalate it
   * @param userId - The user ID of the checker
   * @returns The updated case document
   */
  async checkAndEscalateCase(userId: ObjectId) {
    const pendingCases = await this.repository.findPaginated(
      { status: "pending" },
      undefined,
      { sort: { createdAt: -1 }, limit: 10 }
    );

    if (pendingCases.data.length === 0) {
      return [];
    }

    const overDueCases = pendingCases.data.filter((_case) => {
      const escalationDate = new Date(_case.mediationDetails.scheduledDate);
      const currentDate = new Date();
      const timeDiffInHours =
        (currentDate.getTime() - escalationDate.getTime()) / (1000 * 60 * 60);
      return timeDiffInHours >= 15;
    });

    if (overDueCases.length === 0) {
      return [];
    }

    const bulkEscalatedCase = await this.repository.batchUpdateByIds(
      overDueCases.map((_case) => _case._id as ObjectId),
      { status: "escalated" }
    );

    if (!bulkEscalatedCase) {
      throw new BadRequestError("Failed to escalate cases");
    }

    return bulkEscalatedCase;
  }

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
