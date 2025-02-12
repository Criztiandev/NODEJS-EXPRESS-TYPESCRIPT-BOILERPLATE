
  import { FilterQuery, ObjectId } from "mongoose";
import activityRepository from "../repository/activity.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { Activity } from "../interface/activity.interface";
import { QueryParams } from "../../../interface/pagination.interface";


class ActivityService {
  // FIND OPERATIONS
  async getPaginatedActivitys(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Activity> = {};

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

    return activityRepository.findPaginatedActivitys(filters, undefined, page, limit);
  }

  async getPaginatedSoftDeletedActivitys(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Activity> = {
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

    return activityRepository.findPaginatedActivitys(filters, undefined, page, limit);
  }

  async getActivity(activityId: ObjectId | string) {
    const credentials = await activityRepository.findActivityById(activityId);

    if (!credentials) {
      throw new BadRequestError("activity not found");
    }

    return credentials;
  }

  async getActivityByFilters(filters: FilterQuery<Activity>) {
    const credentials = await activityRepository.findAllActivitys(filters);

    if (!credentials) {
      throw new BadRequestError("activity not found");
    }

    return credentials;
  }

  async getSoftDeletedActivity(activityId: ObjectId | string) {
    console.log(await activityRepository.findSoftDeletedActivityById(activityId));
    const credentials = await activityRepository.findSoftDeletedActivityById(activityId);

    if (!credentials) {
      throw new BadRequestError("activity not found");
    }

    return credentials;
  }

  // CREATE OPERATIONS
  async createActivity(payload: Activity) {
    const credentials = await activityRepository.findActivityById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("Activity already exists");
    }

    return activityRepository.createActivity(payload);
  }

  // UPDATE OPERATIONS
  async updateActivity(id: ObjectId | string, payload: Activity) {
    const credentials = await activityRepository.findActivityById(id);

    if (!credentials) {
      throw new BadRequestError("activity not found");
    }

    return activityRepository.updateActivityByFilters({ _id: id }, payload);
  }

  async batchUpdateActivitysById(activityIds: ObjectId[] | string[], payload: Activity) {
    const activitys = await activityRepository.findAllActivitys({ _id: { $in: activityIds } });


    if (activitys.length !== activityIds.length) {
      throw new BadRequestError("activity not found");
    }

    return activityRepository.batchUpdateActivitysByIds(activityIds, payload);
  }

  // SOFT DELETE OPERATIONS
  async softDeleteActivity(activityId: ObjectId) {
    const result = await activityRepository.findSoftDeletedActivityById(activityId);

    console.log(result);

    if (!result) {
      throw new BadRequestError("activity not found");
    }

    return activityRepository.softDeleteActivitysByFilters({ _id: activityId });
  }

  async batchSoftDeleteActivitys(activityIds: ObjectId[] | string[]) {
    const activitys = await activityRepository.findAllActivitys({ _id: { $in: activityIds } });

    if (activitys.length !== activityIds.length) {
      throw new BadRequestError("activity not found");
    }

    return activityRepository.batchSoftDeleteActivitys(activityIds);
  }

  async restoreSoftDeletedActivity(activityId: ObjectId | string) {
    const credentials = await activityRepository.findSoftDeletedActivityById(
      activityId,
      "_id"
    );

    if (!credentials) {
      throw new BadRequestError("activity not found");
    }

    const result = await activityRepository.restoreSoftDeletedActivityById(activityId);

    if (!result) {
      throw new BadRequestError('Failed to restore activity');
    }

    return result;
  }

  // HARD DELETE OPERATIONS
  async hardDeleteActivity(activityId: ObjectId) {
    const _activity = await activityRepository.findActivityById(activityId);

    if (!_activity) {
      throw new BadRequestError("activity not found");
    }

    return activityRepository.hardDeleteActivityById(activityId);
  }
}

export default new ActivityService();

  