import { FilterQuery, ObjectId } from "mongoose";
import caseModel, { Case } from "../../../model/case.model";

class CaseRepository {
  async findAllCases(filters: FilterQuery<Case>, select?: string) {
    return await caseModel
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findCaseById(caseId: ObjectId | string, select?: string) {
    return caseModel
      .findById(caseId)
      .lean()
      .select(select ?? "");
  }

  async findPaginatedCases(
    filters: FilterQuery<Case>,
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
      caseModel
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      caseModel.countDocuments(filters),
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

  async findSoftDeletedCaseById(caseId: ObjectId | string, select?: string) {
    return caseModel
      .findOne({ _id: caseId, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedSoftDeletedCases(
    filters: FilterQuery<Case>,
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
      caseModel
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      caseModel.countDocuments(filters),
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

  async createCase(credentials: Case) {
    return await caseModel.create(credentials);
  }

  async updateCaseByFilters(
    filters: FilterQuery<Case>,
    credentials: Case,
    select?: string
  ) {
    return await caseModel
      .findOneAndUpdate(filters, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
  }

  async batchUpdateCasesByIds(
    caseIds: ObjectId[] | string[],
    credentials: Case
  ) {
    return await caseModel.updateMany({ _id: { $in: caseIds } }, credentials);
  }

  async softDeleteCasesByFilters(filters: FilterQuery<Case>) {
    return await caseModel.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDeleteCases(caseIds: ObjectId[] | string[]) {
    return await caseModel.updateMany(
      { _id: { $in: caseIds }, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreSoftDeletedCaseById(caseId: ObjectId | string) {
    return await caseModel.findOneAndUpdate(
      { _id: caseId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async hardDeleteCaseById(caseId: ObjectId | string) {
    return await caseModel.findByIdAndDelete(caseId);
  }

  private buildPaginationParams(
    filters: FilterQuery<Case>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    // If no page/limit provided, use defaults
    const effectivePage = page ?? 1;
    const effectiveLimit = limit ?? 10;
    const skip = (effectivePage - 1) * effectiveLimit;

    const query = caseModel.find(filters);

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

export default new CaseRepository();
