
  import { FilterQuery, ObjectId } from "mongoose";
import complainantRepository from "../repository/complainant.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { Complainant } from "../interface/complainant.interface";
import { QueryParams } from "../../../interface/pagination.interface";


class ComplainantService {
  // FIND OPERATIONS
  async getPaginatedComplainants(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Complainant> = {};

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

    return complainantRepository.findPaginatedComplainants(filters, undefined, page, limit);
  }

  async getPaginatedSoftDeletedComplainants(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Complainant> = {
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

    return complainantRepository.findPaginatedComplainants(filters, undefined, page, limit);
  }

  async getComplainant(complainantId: ObjectId | string) {
    const credentials = await complainantRepository.findComplainantById(complainantId);

    if (!credentials) {
      throw new BadRequestError("complainant not found");
    }

    return credentials;
  }

  async getComplainantByFilters(filters: FilterQuery<Complainant>) {
    const credentials = await complainantRepository.findAllComplainants(filters);

    if (!credentials) {
      throw new BadRequestError("complainant not found");
    }

    return credentials;
  }

  async getSoftDeletedComplainant(complainantId: ObjectId | string) {
    console.log(await complainantRepository.findSoftDeletedComplainantById(complainantId));
    const credentials = await complainantRepository.findSoftDeletedComplainantById(complainantId);

    if (!credentials) {
      throw new BadRequestError("complainant not found");
    }

    return credentials;
  }

  // CREATE OPERATIONS
  async createComplainant(payload: Complainant) {
    const credentials = await complainantRepository.findComplainantById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("Complainant already exists");
    }

    return complainantRepository.createComplainant(payload);
  }

  // UPDATE OPERATIONS
  async updateComplainant(id: ObjectId | string, payload: Complainant) {
    const credentials = await complainantRepository.findComplainantById(id);

    if (!credentials) {
      throw new BadRequestError("complainant not found");
    }

    return complainantRepository.updateComplainantByFilters({ _id: id }, payload);
  }

  async batchUpdateComplainantsById(complainantIds: ObjectId[] | string[], payload: Complainant) {
    const complainants = await complainantRepository.findAllComplainants({ _id: { $in: complainantIds } });


    if (complainants.length !== complainantIds.length) {
      throw new BadRequestError("complainant not found");
    }

    return complainantRepository.batchUpdateComplainantsByIds(complainantIds, payload);
  }

  // SOFT DELETE OPERATIONS
  async softDeleteComplainant(complainantId: ObjectId) {
    const result = await complainantRepository.findSoftDeletedComplainantById(complainantId);

    console.log(result);

    if (!result) {
      throw new BadRequestError("complainant not found");
    }

    return complainantRepository.softDeleteComplainantsByFilters({ _id: complainantId });
  }

  async batchSoftDeleteComplainants(complainantIds: ObjectId[] | string[]) {
    const complainants = await complainantRepository.findAllComplainants({ _id: { $in: complainantIds } });

    if (complainants.length !== complainantIds.length) {
      throw new BadRequestError("complainant not found");
    }

    return complainantRepository.batchSoftDeleteComplainants(complainantIds);
  }

  async restoreSoftDeletedComplainant(complainantId: ObjectId | string) {
    const credentials = await complainantRepository.findSoftDeletedComplainantById(
      complainantId,
      "_id"
    );

    if (!credentials) {
      throw new BadRequestError("complainant not found");
    }

    const result = await complainantRepository.restoreSoftDeletedComplainantById(complainantId);

    if (!result) {
      throw new BadRequestError('Failed to restore complainant');
    }

    return result;
  }

  // HARD DELETE OPERATIONS
  async hardDeleteComplainant(complainantId: ObjectId) {
    const _complainant = await complainantRepository.findComplainantById(complainantId);

    if (!_complainant) {
      throw new BadRequestError("complainant not found");
    }

    return complainantRepository.hardDeleteComplainantById(complainantId);
  }
}

export default new ComplainantService();

  