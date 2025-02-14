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
    const existingBarangay = await this.getItemsByFilters({
      $and: [
        { name: payload.name },
        { municipality: payload.municipality },
        { province: payload.province },
      ],
    });

    if (existingBarangay.length > 0) {
      throw new BadRequestError("Barangay already exists");
    }

    const newBarangay = await this.createItem(payload);

    if (!newBarangay) {
      throw new BadRequestError("Failed to create barangay");
    }

    await auditService.createItem({
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
    const existingBarangay = await this.getItem(barangayId);

    if (!existingBarangay) {
      throw new BadRequestError("Barangay not found");
    }

    // check existing bararangay with same name, municipality, province and say it as taken
    const existingBarangayWithSameName = await this.getItemsByFilters({
      $and: [
        { name: payload.name },
        { municipality: payload.municipality },
        { province: payload.province },
        {},
      ],
    });

    if (existingBarangayWithSameName.length > 0) {
      throw new BadRequestError(
        "Barangay name, municipality, province is taken"
      );
    }

    const updatedBarangay = await this.updateItem(barangayId, payload, {
      select: "-isDeleted -deletedAt -createdAt -updatedAt",
    });

    if (!updatedBarangay) {
      throw new BadRequestError("Failed to update barangay");
    }

    await auditService.createItem({
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
