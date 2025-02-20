import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { HearingDocument } from "../interface/hearing.interface";
import hearingRepository from "../repository/hearing.repository";

class HearingService extends BaseService<HearingDocument> {
  constructor(hearingRepository: BaseRepository<HearingDocument>) {
    super(hearingRepository);
  }

  async createHearing(payload: HearingDocument) {
    const query = {
      case: payload.case,
    };

    await this.validateItemExists(query, {
      isExist: true,
      errorMessage: "Hearing already exists",
    });

    const newHearing = await this.repository.create(payload);
    return newHearing;
  }

  async updateHearing(id: string, payload: Partial<HearingDocument>) {
    await this.validateItemExists(
      { _id: id },
      {
        isExist: false,
        errorMessage: "Hearing not found",
      }
    );

    const updatedHearing = await this.repository.update({ _id: id }, payload, {
      select: "_id",
    });
    return updatedHearing;
  }
}

export default new HearingService(hearingRepository);
