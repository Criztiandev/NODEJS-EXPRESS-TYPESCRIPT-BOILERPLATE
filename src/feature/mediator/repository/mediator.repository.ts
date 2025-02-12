
import { FilterQuery, ObjectId } from "mongoose";
import mediatorModel from "../../../model/mediator.model";
import { Mediator } from "../interface/mediator.interface";

class MediatorRepository {
  async findAllMediators(filters: FilterQuery<Mediator>, select?: string) {
    return await mediatorModel
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findMediatorById(mediatorId: ObjectId | string, select?: string) {
    return mediatorModel
      .findById(mediatorId)
      .lean()
      .select(select ?? "");
  }

  async findPaginatedMediators(
    filters: FilterQuery<Mediator>,
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
      mediatorModel
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      mediatorModel.countDocuments(filters),
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

  async findSoftDeletedMediatorById(mediatorId: ObjectId | string, select?: string) {
    return mediatorModel
      .findOne({ _id: mediatorId, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedSoftDeletedMediators(
    filters: FilterQuery<Mediator>,
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
      mediatorModel
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      mediatorModel.countDocuments(filters),
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

  async createMediator(credentials: Mediator) {
    return await mediatorModel.create(credentials);
  }

  async updateMediatorByFilters(
    filters: FilterQuery<Mediator>,
    credentials: Mediator,
    select?: string
  ) {
    return await mediatorModel
      .findOneAndUpdate(filters, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
  }

  async batchUpdateMediatorsByIds(
    mediatorIds: ObjectId[] | string[],
    credentials: Mediator
  ) {
    return await mediatorModel.updateMany({ _id: { $in: mediatorIds } }, credentials);
  }

  async softDeleteMediatorsByFilters(filters: FilterQuery<Mediator>) {
    return await mediatorModel.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDeleteMediators(mediatorIds: ObjectId[] | string[]) {
    return await mediatorModel.updateMany(
      { _id: { $in: mediatorIds }, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreSoftDeletedMediatorById(mediatorId: ObjectId | string) {
    return await mediatorModel.findOneAndUpdate(
      { _id: mediatorId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async hardDeleteMediatorById(mediatorId: ObjectId | string) {
    return await mediatorModel.findByIdAndDelete(mediatorId);
  }

  private buildPaginationParams(
    filters: FilterQuery<Mediator>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    // If no page/limit provided, use defaults
    const effectivePage = page ?? 1;
    const effectiveLimit = limit ?? 10;
    const skip = (effectivePage - 1) * effectiveLimit;

    const query = mediatorModel.find(filters);

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

export default new MediatorRepository();
  