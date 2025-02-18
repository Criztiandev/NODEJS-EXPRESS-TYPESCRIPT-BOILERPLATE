import { BaseService } from "../../../core/base/service/base.service";
import { BadRequestError } from "../../../utils/error.utils";
import { CaseDocument } from "../interface/case.interface";
import CaseRepository from "../repository/case.repository";
import userRepository from "../../user/repository/user.repository";
import officialsService from "../../officials/service/officials.service";
import { ObjectId } from "mongoose";

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

    // check medicator exist
    await officialsService.validateExists(
      payload.mediationDetails?.mediator as ObjectId,
      {
        errorMessage: "Mediator not found",
      }
    );

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

    // check if the case already exists
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
