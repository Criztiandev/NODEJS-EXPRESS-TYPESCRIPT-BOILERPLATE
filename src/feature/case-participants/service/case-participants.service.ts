import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import caseparticipantsRepository from "../repository/case-participants.repository";
import {
  CaseParticipantsDocument,
  CaseParticipantsInput,
  Participants,
} from "../interface/case-participants.interface";
import userService from "../../user/service/user.service";
import { ObjectId } from "mongoose";
import { BadRequestError } from "../../../utils/error.utils";

class CaseparticipantsService extends BaseService<CaseParticipantsDocument> {
  constructor(
    caseparticipantsRepository: BaseRepository<CaseParticipantsDocument>
  ) {
    super(caseparticipantsRepository);
  }

  async createCaseParticipants(payload: CaseParticipantsInput) {
    const { case: caseId, participants } = payload;

    await this.validateParticipants(participants);

    const newParticipants = await this.repository.create({
      case: caseId as ObjectId,
      complainants: this.transformParticipants(participants.complainants),
      respondents: this.transformParticipants(participants.respondents),
      witnesses: this.transformParticipants(participants.witnesses ?? []),
    });

    if (!newParticipants) {
      throw new BadRequestError("Failed to create case participants");
    }

    return newParticipants;
  }

  // Private functions
  private async validateParticipants(participants: {
    complainants: string[];
    respondents: string[];
    witnesses?: string[];
  }) {
    await userService.validateMultipleItems(
      { _id: { $in: participants.complainants } },
      {
        errorMessage:
          "Complainants not found, Please provide valid complainants",
      }
    );

    await userService.validateMultipleItems(
      { _id: { $in: participants.respondents } },
      {
        errorMessage: "Respondents not found, Please provide valid respondents",
      }
    );

    if (participants.witnesses) {
      await userService.validateMultipleItems(
        { _id: { $in: participants.witnesses } },
        { errorMessage: "Witnesses not found, Please provide valid witnesses" }
      );
    }
  }

  private transformParticipants(participants: string[]): Participants[] {
    return participants.map((participant) => ({
      resident: participant,
      status: "active",
      joinedDate: new Date(),
      withdrawalDate: null,
      withdrawalReason: null,
      remarks: null,
    }));
  }
}

export default new CaseparticipantsService(caseparticipantsRepository);
