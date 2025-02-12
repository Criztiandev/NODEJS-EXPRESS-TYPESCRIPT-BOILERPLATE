
import { FilterQuery, ObjectId } from "mongoose";
import barangayModel from "../../../model/barangay.model";
import { Barangay } from "../interface/barangay.interface";

class BarangayRepository {
  async findAllBarangays(filters: FilterQuery<Barangay>, select?: string) {
    return await barangayModel
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findBarangayById(barangayId: ObjectId | string, select?: string) {
    return barangayModel
      .findById(barangayId)
      .lean()
      .select(select ?? "");
  }

  async findPaginatedBarangays(
    filters: FilterQuery<Barangay>,
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
      barangayModel
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      barangayModel.countDocuments(filters),
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

  async findSoftDeletedBarangayById(barangayId: ObjectId | string, select?: string) {
    return barangayModel
      .findOne({ _id: barangayId, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedSoftDeletedBarangays(
    filters: FilterQuery<Barangay>,
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
      barangayModel
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      barangayModel.countDocuments(filters),
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

  async createBarangay(credentials: Barangay) {
    return await barangayModel.create(credentials);
  }

  async updateBarangayByFilters(
    filters: FilterQuery<Barangay>,
    credentials: Barangay,
    select?: string
  ) {
    return await barangayModel
      .findOneAndUpdate(filters, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
  }

  async batchUpdateBarangaysByIds(
    barangayIds: ObjectId[] | string[],
    credentials: Barangay
  ) {
    return await barangayModel.updateMany({ _id: { $in: barangayIds } }, credentials);
  }

  async softDeleteBarangaysByFilters(filters: FilterQuery<Barangay>) {
    return await barangayModel.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDeleteBarangays(barangayIds: ObjectId[] | string[]) {
    return await barangayModel.updateMany(
      { _id: { $in: barangayIds }, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreSoftDeletedBarangayById(barangayId: ObjectId | string) {
    return await barangayModel.findOneAndUpdate(
      { _id: barangayId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async hardDeleteBarangayById(barangayId: ObjectId | string) {
    return await barangayModel.findByIdAndDelete(barangayId);
  }

  private buildPaginationParams(
    filters: FilterQuery<Barangay>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    // If no page/limit provided, use defaults
    const effectivePage = page ?? 1;
    const effectiveLimit = limit ?? 10;
    const skip = (effectivePage - 1) * effectiveLimit;

    const query = barangayModel.find(filters);

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

export default new BarangayRepository();
  