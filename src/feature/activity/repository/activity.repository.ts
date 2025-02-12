
import { FilterQuery, ObjectId } from "mongoose";
import activityModel from "../../../model/activity.model";
import { Activity } from "../interface/activity.interface";

class ActivityRepository {
  async findAllActivitys(filters: FilterQuery<Activity>, select?: string) {
    return await activityModel
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findActivityById(activityId: ObjectId | string, select?: string) {
    return activityModel
      .findById(activityId)
      .lean()
      .select(select ?? "");
  }

  async findPaginatedActivitys(
    filters: FilterQuery<Activity>,
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
      activityModel
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      activityModel.countDocuments(filters),
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

  async findSoftDeletedActivityById(activityId: ObjectId | string, select?: string) {
    return activityModel
      .findOne({ _id: activityId, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedSoftDeletedActivitys(
    filters: FilterQuery<Activity>,
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
      activityModel
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      activityModel.countDocuments(filters),
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

  async createActivity(credentials: Activity) {
    return await activityModel.create(credentials);
  }

  async updateActivityByFilters(
    filters: FilterQuery<Activity>,
    credentials: Activity,
    select?: string
  ) {
    return await activityModel
      .findOneAndUpdate(filters, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
  }

  async batchUpdateActivitysByIds(
    activityIds: ObjectId[] | string[],
    credentials: Activity
  ) {
    return await activityModel.updateMany({ _id: { $in: activityIds } }, credentials);
  }

  async softDeleteActivitysByFilters(filters: FilterQuery<Activity>) {
    return await activityModel.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDeleteActivitys(activityIds: ObjectId[] | string[]) {
    return await activityModel.updateMany(
      { _id: { $in: activityIds }, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreSoftDeletedActivityById(activityId: ObjectId | string) {
    return await activityModel.findOneAndUpdate(
      { _id: activityId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async hardDeleteActivityById(activityId: ObjectId | string) {
    return await activityModel.findByIdAndDelete(activityId);
  }

  private buildPaginationParams(
    filters: FilterQuery<Activity>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    // If no page/limit provided, use defaults
    const effectivePage = page ?? 1;
    const effectiveLimit = limit ?? 10;
    const skip = (effectivePage - 1) * effectiveLimit;

    const query = activityModel.find(filters);

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

export default new ActivityRepository();
  