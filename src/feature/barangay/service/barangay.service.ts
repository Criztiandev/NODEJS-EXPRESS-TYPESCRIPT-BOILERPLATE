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
    // Check if barangay already exists
    const query = {
      $and: [
        { name: payload.name },
        { municipality: payload.municipality },
        { province: payload.province },
      ],
    };
    await this.validateItemExists(query, {
      isExist: true,
      errorMessage: "Barangay already exists",
    });

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
    const barangayIdQuery = { _id: barangayId };
    const barangay = await this.validateItemExists(barangayIdQuery, {
      isExist: false,
      errorMessage: "Barangay not found",
    });

    // check existing bararangay with same name, municipality, province and say it as taken
    const existingBarangayQuery = {
      $and: [
        { name: payload.name },
        { municipality: payload.municipality },
        { province: payload.province },
      ],
    };
    await this.validateItemExists(existingBarangayQuery, {
      isExist: true,
      errorMessage: "Barangay name, municipality, province is taken",
    });

    const updatedBarangay = await this.repository.update(
      barangayIdQuery,
      payload
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
        before: barangay,
        after: payload,
      },
      createdBy: userId,
    });

    return updatedBarangay;
  }
}

export default new BarangayService(barangayRepository);
