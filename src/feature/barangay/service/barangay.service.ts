import { ObjectId } from "mongoose";
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { BadRequestError } from "../../../utils/error.utils";
import auditService from "../../audit/service/audit.service";
import { BarangayDocument } from "../interface/barangay.interface";
import barangayRepository from "../repository/barangay.repository";
import { BarangayInput } from "../validation/barangay.validation";

class BarangayService extends BaseService<BarangayDocument> {
  constructor(barangayRepository: BaseRepository<BarangayDocument>) {
    super(barangayRepository);
  }

  async createBarangay(userId: ObjectId, payload: BarangayInput) {
    const existingBarangay = await this.validateAlreadyExistsByFilters({
      $and: [
        { name: payload.name },
        { municipality: payload.municipality },
        { province: payload.province },
      ],
    });

    if (existingBarangay) {
      throw new BadRequestError("Barangay already exists");
    }

    const newBarangay = await this.repository.create(payload);

    await auditService.createService({
      action: "create",
      entityType: "barangay",
      actionMessage: `Barangay: ${payload.name} created successfully`,
      entityId: newBarangay?._id as ObjectId,
      changes: {
        before: null,
        after: payload,
      },
      createdBy: userId,
    });

    return newBarangay;
  }

  async updateBarangay(
    userId: ObjectId,
    barangayId: string,
    payload: BarangayInput
  ) {
    // check existing barangay
    await this.validateExists(barangayId, {
      errorMessage: "Barangay not found",
    });

    // check existing bararangay with same name, municipality, province and say it as taken
    const existingBarangay = await this.validateExistsByFilters(
      {
        $and: [
          { name: payload.name },
          { municipality: payload.municipality },
          { province: payload.province },
        ],
      },
      {
        errorMessage: "Barangay name, municipality, province is taken",
      }
    );

    const updatedBarangay = await this.repository.update(
      { _id: barangayId },
      payload,
      {
        select: "-isDeleted -deletedAt -createdAt -updatedAt",
      }
    );

    if (!updatedBarangay) {
      throw new BadRequestError("Failed to update barangay");
    }

    await auditService.createService({
      action: "update",
      entityType: "barangay",
      actionMessage: `Barangay: ${payload.name} updated successfully`,
      entityId: updatedBarangay?._id as ObjectId,
      changes: {
        before: existingBarangay,
        after: payload,
      },
      createdBy: userId,
    });

    return updatedBarangay;
  }
}

export default new BarangayService(barangayRepository);
