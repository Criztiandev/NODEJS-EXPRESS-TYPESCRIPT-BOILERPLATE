
  import { FilterQuery, ObjectId } from "mongoose";
import mediatorRepository from "../repository/mediator.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { Mediator } from "../interface/mediator.interface";
import { QueryParams } from "../../../interface/pagination.interface";


class MediatorService {
  // FIND OPERATIONS
  async getPaginatedMediators(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Mediator> = {};

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

    return mediatorRepository.findPaginatedMediators(filters, undefined, page, limit);
  }

  async getPaginatedSoftDeletedMediators(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Mediator> = {
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

    return mediatorRepository.findPaginatedMediators(filters, undefined, page, limit);
  }

  async getMediator(mediatorId: ObjectId | string) {
    const credentials = await mediatorRepository.findMediatorById(mediatorId);

    if (!credentials) {
      throw new BadRequestError("mediator not found");
    }

    return credentials;
  }

  async getMediatorByFilters(filters: FilterQuery<Mediator>) {
    const credentials = await mediatorRepository.findAllMediators(filters);

    if (!credentials) {
      throw new BadRequestError("mediator not found");
    }

    return credentials;
  }

  async getSoftDeletedMediator(mediatorId: ObjectId | string) {
    console.log(await mediatorRepository.findSoftDeletedMediatorById(mediatorId));
    const credentials = await mediatorRepository.findSoftDeletedMediatorById(mediatorId);

    if (!credentials) {
      throw new BadRequestError("mediator not found");
    }

    return credentials;
  }

  // CREATE OPERATIONS
  async createMediator(payload: Mediator) {
    const credentials = await mediatorRepository.findMediatorById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("Mediator already exists");
    }

    return mediatorRepository.createMediator(payload);
  }

  // UPDATE OPERATIONS
  async updateMediator(id: ObjectId | string, payload: Mediator) {
    const credentials = await mediatorRepository.findMediatorById(id);

    if (!credentials) {
      throw new BadRequestError("mediator not found");
    }

    return mediatorRepository.updateMediatorByFilters({ _id: id }, payload);
  }

  async batchUpdateMediatorsById(mediatorIds: ObjectId[] | string[], payload: Mediator) {
    const mediators = await mediatorRepository.findAllMediators({ _id: { $in: mediatorIds } });


    if (mediators.length !== mediatorIds.length) {
      throw new BadRequestError("mediator not found");
    }

    return mediatorRepository.batchUpdateMediatorsByIds(mediatorIds, payload);
  }

  // SOFT DELETE OPERATIONS
  async softDeleteMediator(mediatorId: ObjectId) {
    const result = await mediatorRepository.findSoftDeletedMediatorById(mediatorId);

    console.log(result);

    if (!result) {
      throw new BadRequestError("mediator not found");
    }

    return mediatorRepository.softDeleteMediatorsByFilters({ _id: mediatorId });
  }

  async batchSoftDeleteMediators(mediatorIds: ObjectId[] | string[]) {
    const mediators = await mediatorRepository.findAllMediators({ _id: { $in: mediatorIds } });

    if (mediators.length !== mediatorIds.length) {
      throw new BadRequestError("mediator not found");
    }

    return mediatorRepository.batchSoftDeleteMediators(mediatorIds);
  }

  async restoreSoftDeletedMediator(mediatorId: ObjectId | string) {
    const credentials = await mediatorRepository.findSoftDeletedMediatorById(
      mediatorId,
      "_id"
    );

    if (!credentials) {
      throw new BadRequestError("mediator not found");
    }

    const result = await mediatorRepository.restoreSoftDeletedMediatorById(mediatorId);

    if (!result) {
      throw new BadRequestError('Failed to restore mediator');
    }

    return result;
  }

  // HARD DELETE OPERATIONS
  async hardDeleteMediator(mediatorId: ObjectId) {
    const _mediator = await mediatorRepository.findMediatorById(mediatorId);

    if (!_mediator) {
      throw new BadRequestError("mediator not found");
    }

    return mediatorRepository.hardDeleteMediatorById(mediatorId);
  }
}

export default new MediatorService();

  