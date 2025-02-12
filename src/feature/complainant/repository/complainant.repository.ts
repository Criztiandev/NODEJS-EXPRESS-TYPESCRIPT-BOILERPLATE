
import { FilterQuery, ObjectId } from "mongoose";
import complainantModel from "../../../model/complainant.model";
import { Complainant } from "../interface/complainant.interface";

class ComplainantRepository {
  async findAllComplainants(filters: FilterQuery<Complainant>, select?: string) {
    return await complainantModel
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findComplainantById(complainantId: ObjectId | string, select?: string) {
    return complainantModel
      .findById(complainantId)
      .lean()
      .select(select ?? "");
  }

  async findPaginatedComplainants(
    filters: FilterQuery<Complainant>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    const { effectivePage, effectiveLimit, skip } = this.buildPaginationParams(
      filters,
      select,
      page,
      limit
    );

    const [data, total] = await Promise.all([
      complainantModel
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      complainantModel.countDocuments(filters),
    ]);

    return {
      data,
      pagination: {
        total,
        page: effectivePage,
        limit: effectiveLimit,
        pages: Math.ceil(total / effectiveLimit),
      },
    };
  }

  async findSoftDeletedComplainantById(complainantId: ObjectId | string, select?: string) {
    return complainantModel
      .findOne({ _id: complainantId, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedSoftDeletedComplainants(
    filters: FilterQuery<Complainant>,
    select?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const { effectivePage, effectiveLimit, skip } = this.buildPaginationParams(
      filters,
      select,
      page,
      limit
    );

    const [data, total] = await Promise.all([
      complainantModel
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      complainantModel.countDocuments(filters),
    ]);
    return {
      data,
      pagination: {
        total,
        page: effectivePage,
        limit: effectiveLimit,
        pages: Math.ceil(total / effectiveLimit),
      },
    };
  }

  async createComplainant(credentials: Complainant) {
    return await complainantModel.create(credentials);
  }

  async updateComplainantByFilters(
    filters: FilterQuery<Complainant>,
    credentials: Complainant,
    select?: string
  ) {
    return await complainantModel
      .findOneAndUpdate(filters, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
  }

  async batchUpdateComplainantsByIds(
    complainantIds: ObjectId[] | string[],
    credentials: Complainant
  ) {
    return await complainantModel.updateMany({ _id: { $in: complainantIds } }, credentials);
  }

  async softDeleteComplainantsByFilters(filters: FilterQuery<Complainant>) {
    return await complainantModel.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDeleteComplainants(complainantIds: ObjectId[] | string[]) {
    return await complainantModel.updateMany(
      { _id: { $in: complainantIds }, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreSoftDeletedComplainantById(complainantId: ObjectId | string) {
    return await complainantModel.findOneAndUpdate(
      { _id: complainantId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async hardDeleteComplainantById(complainantId: ObjectId | string) {
    return await complainantModel.findByIdAndDelete(complainantId);
  }

  private buildPaginationParams(
    filters: FilterQuery<Complainant>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    // If no page/limit provided, use defaults
    const effectivePage = page ?? 1;
    const effectiveLimit = limit ?? 10;
    const skip = (effectivePage - 1) * effectiveLimit;

    const query = complainantModel.find(filters);

    // Only apply pagination if both page and limit are provided
    if (page && limit) {
      query.skip(skip).limit(effectiveLimit);
    }

    if (select) {
      query.select(select);
    }

    return { query, skip, effectivePage, effectiveLimit };
  }
}

export default new ComplainantRepository();
  