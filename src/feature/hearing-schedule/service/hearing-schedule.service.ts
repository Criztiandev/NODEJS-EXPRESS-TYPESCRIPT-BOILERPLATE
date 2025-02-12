import { FilterQuery, ObjectId } from "mongoose";
import hearingscheduleRepository from "../repository/hearing-schedule.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { HearingSchedule } from "../interface/hearing-schedule.interface";
import { QueryParams } from "../../../interface/pagination.interface";

class HearingScheduleService {
  // FIND OPERATIONS
  async getPaginatedHearingSchedules(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<HearingSchedule> = {};

    // Add search filter if provided
    if (queryParams.search) {
      filters.$or = [
        { title: { $regex: queryParams.search, $options: "i" } },
        { description: { $regex: queryParams.search, $options: "i" } },
      ];
    }

    // Add status filter if provided
    if (queryParams.status) {
      filters.status = queryParams.status;
    }

    // Add priority filter if provided
    if (queryParams.priority) {
      filters.priority = queryParams.priority;
    }

    // Add date range filter if provided
    if (queryParams.startDate || queryParams.endDate) {
      filters.createdAt = {};
      if (queryParams.startDate) {
        filters.createdAt.$gte = new Date(queryParams.startDate);
      }
      if (queryParams.endDate) {
        filters.createdAt.$lte = new Date(queryParams.endDate);
      }
    }

    return hearingscheduleRepository.findPaginatedHearingSchedules(
      filters,
      undefined,
      page,
      limit
    );
  }

  async getPaginatedSoftDeletedHearingSchedules(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<HearingSchedule> = {
      isDeleted: true,
    };

    // Add search filter if provided
    if (queryParams.search) {
      filters.$or = [
        { title: { $regex: queryParams.search, $options: "i" } },
        { description: { $regex: queryParams.search, $options: "i" } },
      ];
    }

    // Add status filter if provided
    if (queryParams.status) {
      filters.status = queryParams.status;
    }

    // Add priority filter if provided
    if (queryParams.priority) {
      filters.priority = queryParams.priority;
    }

    // Add date range filter if provided
    if (queryParams.startDate || queryParams.endDate) {
      filters.createdAt = {};
      if (queryParams.startDate) {
        filters.createdAt.$gte = new Date(queryParams.startDate);
      }
      if (queryParams.endDate) {
        filters.createdAt.$lte = new Date(queryParams.endDate);
      }
    }

    return hearingscheduleRepository.findPaginatedHearingSchedules(
      filters,
      undefined,
      page,
      limit
    );
  }

  async getHearingSchedule(hearingscheduleId: ObjectId | string) {
    const credentials = await hearingscheduleRepository.findHearingScheduleById(
      hearingscheduleId
    );

    if (!credentials) {
      throw new BadRequestError("hearingschedule not found");
    }

    return credentials;
  }

  async getHearingScheduleByFilters(filters: FilterQuery<HearingSchedule>) {
    const credentials = await hearingscheduleRepository.findAllHearingSchedules(
      filters
    );

    if (!credentials) {
      throw new BadRequestError("hearingschedule not found");
    }

    return credentials;
  }

  async getSoftDeletedHearingSchedule(hearingscheduleId: ObjectId | string) {
    console.log(
      await hearingscheduleRepository.findSoftDeletedHearingScheduleById(
        hearingscheduleId
      )
    );
    const credentials =
      await hearingscheduleRepository.findSoftDeletedHearingScheduleById(
        hearingscheduleId
      );

    if (!credentials) {
      throw new BadRequestError("hearingschedule not found");
    }

    return credentials;
  }

  // CREATE OPERATIONS
  async createHearingSchedule(payload: HearingSchedule) {
    const credentials = await hearingscheduleRepository.findHearingScheduleById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("HearingSchedule already exists");
    }

    return hearingscheduleRepository.createHearingSchedule(payload);
  }

  // UPDATE OPERATIONS
  async updateHearingSchedule(id: ObjectId | string, payload: HearingSchedule) {
    const credentials = await hearingscheduleRepository.findHearingScheduleById(
      id
    );

    if (!credentials) {
      throw new BadRequestError("hearingschedule not found");
    }

    return hearingscheduleRepository.updateHearingScheduleByFilters(
      { _id: id },
      payload
    );
  }

  async batchUpdateHearingSchedulesById(
    hearingscheduleIds: ObjectId[] | string[],
    payload: HearingSchedule
  ) {
    const hearingschedules =
      await hearingscheduleRepository.findAllHearingSchedules({
        _id: { $in: hearingscheduleIds },
      });

    if (hearingschedules.length !== hearingscheduleIds.length) {
      throw new BadRequestError("hearingschedule not found");
    }

    return hearingscheduleRepository.batchUpdateHearingSchedulesByIds(
      hearingscheduleIds,
      payload
    );
  }

  // SOFT DELETE OPERATIONS
  async softDeleteHearingSchedule(hearingscheduleId: ObjectId) {
    const result =
      await hearingscheduleRepository.findSoftDeletedHearingScheduleById(
        hearingscheduleId
      );

    console.log(result);

    if (!result) {
      throw new BadRequestError("hearingschedule not found");
    }

    return hearingscheduleRepository.softDeleteHearingSchedulesByFilters({
      _id: hearingscheduleId,
    });
  }

  async batchSoftDeleteHearingSchedules(
    hearingscheduleIds: ObjectId[] | string[]
  ) {
    const hearingschedules =
      await hearingscheduleRepository.findAllHearingSchedules({
        _id: { $in: hearingscheduleIds },
      });

    if (hearingschedules.length !== hearingscheduleIds.length) {
      throw new BadRequestError("hearingschedule not found");
    }

    return hearingscheduleRepository.batchSoftDeleteHearingSchedules(
      hearingscheduleIds
    );
  }

  async restoreSoftDeletedHearingSchedule(
    hearingscheduleId: ObjectId | string
  ) {
    const credentials =
      await hearingscheduleRepository.findSoftDeletedHearingScheduleById(
        hearingscheduleId,
        "_id"
      );

    if (!credentials) {
      throw new BadRequestError("hearingschedule not found");
    }

    const result =
      await hearingscheduleRepository.restoreSoftDeletedHearingScheduleById(
        hearingscheduleId
      );

    if (!result) {
      throw new BadRequestError("Failed to restore hearingschedule");
    }

    return result;
  }

  // HARD DELETE OPERATIONS
  async hardDeleteHearingSchedule(hearingscheduleId: ObjectId) {
    const _hearingschedule =
      await hearingscheduleRepository.findHearingScheduleById(
        hearingscheduleId
      );

    if (!_hearingschedule) {
      throw new BadRequestError("hearingschedule not found");
    }

    return hearingscheduleRepository.hardDeleteHearingScheduleById(
      hearingscheduleId
    );
  }
}

export default new HearingScheduleService();
