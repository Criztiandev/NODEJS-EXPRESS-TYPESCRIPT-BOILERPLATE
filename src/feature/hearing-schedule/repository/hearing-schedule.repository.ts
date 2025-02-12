import { FilterQuery, ObjectId } from "mongoose";
import hearingscheduleModel from "../../../model/hearing-schedule.model";
import { HearingSchedule } from "../interface/hearing-schedule.interface";

class HearingScheduleRepository {
  async findAllHearingSchedules(
    filters: FilterQuery<HearingSchedule>,
    select?: string
  ) {
    return await hearingscheduleModel
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findHearingScheduleById(
    hearingscheduleId: ObjectId | string,
    select?: string
  ) {
    return hearingscheduleModel
      .findById(hearingscheduleId)
      .lean()
      .select(select ?? "");
  }

  async findPaginatedHearingSchedules(
    filters: FilterQuery<HearingSchedule>,
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
      hearingscheduleModel
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      hearingscheduleModel.countDocuments(filters),
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

  async findSoftDeletedHearingScheduleById(
    hearingscheduleId: ObjectId | string,
    select?: string
  ) {
    return hearingscheduleModel
      .findOne({ _id: hearingscheduleId, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedSoftDeletedHearingSchedules(
    filters: FilterQuery<HearingSchedule>,
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
      hearingscheduleModel
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      hearingscheduleModel.countDocuments(filters),
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

  async createHearingSchedule(credentials: HearingSchedule) {
    return await hearingscheduleModel.create(credentials);
  }

  async updateHearingScheduleByFilters(
    filters: FilterQuery<HearingSchedule>,
    credentials: HearingSchedule,
    select?: string
  ) {
    return await hearingscheduleModel
      .findOneAndUpdate(filters, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
  }

  async batchUpdateHearingSchedulesByIds(
    hearingscheduleIds: ObjectId[] | string[],
    credentials: HearingSchedule
  ) {
    return await hearingscheduleModel.updateMany(
      { _id: { $in: hearingscheduleIds } },
      credentials
    );
  }

  async softDeleteHearingSchedulesByFilters(
    filters: FilterQuery<HearingSchedule>
  ) {
    return await hearingscheduleModel.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDeleteHearingSchedules(
    hearingscheduleIds: ObjectId[] | string[]
  ) {
    return await hearingscheduleModel.updateMany(
      { _id: { $in: hearingscheduleIds }, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreSoftDeletedHearingScheduleById(
    hearingscheduleId: ObjectId | string
  ) {
    return await hearingscheduleModel.findOneAndUpdate(
      { _id: hearingscheduleId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async hardDeleteHearingScheduleById(hearingscheduleId: ObjectId | string) {
    return await hearingscheduleModel.findByIdAndDelete(hearingscheduleId);
  }

  private buildPaginationParams(
    filters: FilterQuery<HearingSchedule>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    // If no page/limit provided, use defaults
    const effectivePage = page ?? 1;
    const effectiveLimit = limit ?? 10;
    const skip = (effectivePage - 1) * effectiveLimit;

    const query = hearingscheduleModel.find(filters);

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

export default new HearingScheduleRepository();
