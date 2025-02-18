import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { BadRequestError } from "../../../utils/error.utils";
import barangayService from "../../barangay/service/barangay.service";
import userService from "../../user/service/user.service";
import { OfficialsDocument } from "../interface/officials.interface";
import officialsRepository from "../repository/officials.repository";

class OfficialsService extends BaseService<OfficialsDocument> {
  constructor(officialsRepository: BaseRepository<OfficialsDocument>) {
    super(officialsRepository);
  }

  async createOfficial(body: OfficialsDocument) {
    const { user, barangay, position } = body;

    // check if the user is already an official
    await userService.validateExists(user, {
      errorMessage: "User not found",
    });

    // check if the barangay exist
    await barangayService.validateExists(barangay, {
      errorMessage: "Barangay not found",
    });

    // check if the position is already taken in same barangay
    const officialsParams = { position, barangay };
    await this.validateAlreadyExistsByFilters(officialsParams, {
      errorMessage: "Position already taken",
    });

    return officialsRepository.create(body);
  }

  async updateOfficial(id: string, body: OfficialsDocument) {
    const { user, barangay, position } = body;

    // check if the user is already an official
    await userService.validateExists(user, {
      errorMessage: "User not found",
    });

    // check if the barangay exist
    await barangayService.validateExists(barangay, {
      errorMessage: "Barangay not found",
    });

    // check if the position is already taken in same barangay
    const officialsParams = { position, barangay };
    await this.validateExistsByFilters(officialsParams, {
      errorMessage: "Position already taken",
    });

    return officialsRepository.update({ _id: id }, body, {
      select: "-isDeleted -deletedAt -createdAt -updatedAt",
    });
  }
}

export default new OfficialsService(officialsRepository);
