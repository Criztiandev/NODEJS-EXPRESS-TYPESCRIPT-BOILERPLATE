export const repositoryTemplate = `
import { FilterQuery, ObjectId } from "mongoose";
import caseModel, { Case } from "../../../model/case.model";

class CaseRepository {
  async findCaseById(caseId: ObjectId | string, select?: string) {
    return caseModel
      .findById(caseId)
      .lean()
      .select(select ?? "");
  }

  async findSoftDeletedCaseById(caseId: ObjectId | string, select?: string) {
    return caseModel
      .findOne({ _id: caseId, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedCases(
    filters: FilterQuery<Case>,
    select?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      caseModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .lean()
        .select(select ?? ""),
      caseModel.countDocuments(filters),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findPaginatedSoftDeletedCases(
    filters: FilterQuery<Case>,
    select?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      caseModel
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(limit)
        .lean()
        .select(select ?? ""),
      caseModel.countDocuments({ ...filters, isDeleted: true }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findAllCases(filters: FilterQuery<Case>, select?: string) {
    return await caseModel
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findAllSoftDeletedCases(filters: FilterQuery<Case>, select?: string) {
    return await caseModel
      .find({ ...filters, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async createCase(credentials: Case) {
    return await caseModel.create(credentials);
  }

  async updateCaseById(
    caseId: ObjectId | string,
    credentials: Case,
    select?: string
  ) {
    return await caseModel
      .findByIdAndUpdate(caseId, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
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

  async batchUpdateCasesByFilters(
    filters: FilterQuery<Case>,
    credentials: Case
  ) {
    return await caseModel.updateMany(filters, credentials);
  }

  async deleteCaseById(caseId: ObjectId | string) {
    return await caseModel.findByIdAndDelete(caseId);
  }

  async deleteCaseByFilters(filters: FilterQuery<Case>) {
    return await caseModel.deleteMany(filters);
  }

  async softDeleteCaseById(caseId: ObjectId | string) {
    return await caseModel.findByIdAndUpdate(caseId, { isDeleted: true });
  }

  async softDeleteCaseByFilters(filters: FilterQuery<Case>) {
    return await caseModel.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDeleteCases(caseIds: ObjectId[] | string[]) {
    return await caseModel.updateMany({}, { isDeleted: true });
  }

  async hardDeleteCaseById(caseId: ObjectId | string) {
    return await caseModel.findByIdAndDelete(caseId);
  }

  async hardDeleteCaseByFilters(filters: FilterQuery<Case>) {
    return await caseModel.deleteMany(filters);
  }

  async batchHardDeleteCases(caseIds: ObjectId[] | string[]) {
    return await caseModel.deleteMany({ _id: { $in: caseIds } });
  }

  async restoreCaseById(caseId: ObjectId | string) {
    return await caseModel.findByIdAndUpdate(caseId, { isDeleted: false });
  }

  async restoreCaseByFilters(filters: FilterQuery<Case>) {
    return await caseModel.updateMany(filters, { isDeleted: false });
  }
}

export default new CaseRepository();
`;
