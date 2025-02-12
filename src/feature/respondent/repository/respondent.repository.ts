
import { FilterQuery, ObjectId } from "mongoose";
import respondentModel from "../../../model/respondent.model";
import { Respondent } from "../interface/respondent.interface";

class RespondentRepository {
  async findAllRespondents(filters: FilterQuery<Respondent>, select?: string) {
    return await respondentModel
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findRespondentById(respondentId: ObjectId | string, select?: string) {
    return respondentModel
      .findById(respondentId)
      .lean()
      .select(select ?? "");
  }

  async findPaginatedRespondents(
    filters: FilterQuery<Respondent>,
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
      respondentModel
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      respondentModel.countDocuments(filters),
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

  async findSoftDeletedRespondentById(respondentId: ObjectId | string, select?: string) {
    return respondentModel
      .findOne({ _id: respondentId, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedSoftDeletedRespondents(
    filters: FilterQuery<Respondent>,
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
      respondentModel
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      respondentModel.countDocuments(filters),
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

  async createRespondent(credentials: Respondent) {
    return await respondentModel.create(credentials);
  }

  async updateRespondentByFilters(
    filters: FilterQuery<Respondent>,
    credentials: Respondent,
    select?: string
  ) {
    return await respondentModel
      .findOneAndUpdate(filters, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
  }

  async batchUpdateRespondentsByIds(
    respondentIds: ObjectId[] | string[],
    credentials: Respondent
  ) {
    return await respondentModel.updateMany({ _id: { $in: respondentIds } }, credentials);
  }

  async softDeleteRespondentsByFilters(filters: FilterQuery<Respondent>) {
    return await respondentModel.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDeleteRespondents(respondentIds: ObjectId[] | string[]) {
    return await respondentModel.updateMany(
      { _id: { $in: respondentIds }, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreSoftDeletedRespondentById(respondentId: ObjectId | string) {
    return await respondentModel.findOneAndUpdate(
      { _id: respondentId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async hardDeleteRespondentById(respondentId: ObjectId | string) {
    return await respondentModel.findByIdAndDelete(respondentId);
  }

  private buildPaginationParams(
    filters: FilterQuery<Respondent>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    // If no page/limit provided, use defaults
    const effectivePage = page ?? 1;
    const effectiveLimit = limit ?? 10;
    const skip = (effectivePage - 1) * effectiveLimit;

    const query = respondentModel.find(filters);

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

export default new RespondentRepository();
  