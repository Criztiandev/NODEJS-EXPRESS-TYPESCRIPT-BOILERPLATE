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
    const { user, barangay, position, termStart, termEnd, isActive } = body;

    // check if the user is already an official
    const existingUser = await userService.validateExists(user);

    if (!existingUser) {
      throw new BadRequestError("User not found");
    }

    // check if the barangay exist
    await barangayService.validateExists(barangay, {
      errorMessage: "Barangay not found",
    });

    // check if the position is already taken
    await this.validateExistsByFilters(
      {
        position,
        barangay,
      },
      {
        errorMessage: "Position already taken",
      }
    );

    return officialsRepository.create(body);
  }
}

export default new OfficialsService(officialsRepository);
