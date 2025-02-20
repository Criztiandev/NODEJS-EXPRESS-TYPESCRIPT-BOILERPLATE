import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import caseparticipantsRepository from "../repository/case-participants.repository";
import {
  CaseParticipantsDocument,
  CaseParticipantsInput,
} from "../interface/case-participants.interface";
import userService from "../../user/service/user.service";

class CaseparticipantsService extends BaseService<CaseParticipantsDocument> {
  constructor(
    caseparticipantsRepository: BaseRepository<CaseParticipantsDocument>
  ) {
    super(caseparticipantsRepository);
  }

  async createCaseParticipants(payload: CaseParticipantsInput) {
    const { case: caseId, participants } = payload;

    // Validate if the participants are existing
    await validateParticipants(participants);
  }
}

const validateParticipants = async (participants: {
  complainants: string[];
  respondents: string[];
  witnesses?: string[];
}) => {
  console.log(participants);
  await userService.validateMultipleItems(
    {
      _id: { $in: participants.complainants },
    },
    {
      errorMessage: "Complainants not found, Please provide valid complainants",
    }
  );

  await userService.validateMultipleItems({
    _id: { $in: participants.respondents },
  });
};

export default new CaseparticipantsService(caseparticipantsRepository);
