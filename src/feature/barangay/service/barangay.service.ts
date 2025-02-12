
  import { FilterQuery, ObjectId } from "mongoose";
import barangayRepository from "../repository/barangay.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { Barangay } from "../interface/barangay.interface";
import { QueryParams } from "../../../interface/pagination.interface";


class BarangayService {
  // FIND OPERATIONS
  async getPaginatedBarangays(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Barangay> = {};

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

    return barangayRepository.findPaginatedBarangays(filters, undefined, page, limit);
  }

  async getPaginatedSoftDeletedBarangays(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Barangay> = {
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

    return barangayRepository.findPaginatedBarangays(filters, undefined, page, limit);
  }

  async getBarangay(barangayId: ObjectId | string) {
    const credentials = await barangayRepository.findBarangayById(barangayId);

    if (!credentials) {
      throw new BadRequestError("barangay not found");
    }

    return credentials;
  }

  async getBarangayByFilters(filters: FilterQuery<Barangay>) {
    const credentials = await barangayRepository.findAllBarangays(filters);

    if (!credentials) {
      throw new BadRequestError("barangay not found");
    }

    return credentials;
  }

  async getSoftDeletedBarangay(barangayId: ObjectId | string) {
    console.log(await barangayRepository.findSoftDeletedBarangayById(barangayId));
    const credentials = await barangayRepository.findSoftDeletedBarangayById(barangayId);

    if (!credentials) {
      throw new BadRequestError("barangay not found");
    }

    return credentials;
  }

  // CREATE OPERATIONS
  async createBarangay(payload: Barangay) {
    const credentials = await barangayRepository.findBarangayById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("Barangay already exists");
    }

    return barangayRepository.createBarangay(payload);
  }

  // UPDATE OPERATIONS
  async updateBarangay(id: ObjectId | string, payload: Barangay) {
    const credentials = await barangayRepository.findBarangayById(id);

    if (!credentials) {
      throw new BadRequestError("barangay not found");
    }

    return barangayRepository.updateBarangayByFilters({ _id: id }, payload);
  }

  async batchUpdateBarangaysById(barangayIds: ObjectId[] | string[], payload: Barangay) {
    const barangays = await barangayRepository.findAllBarangays({ _id: { $in: barangayIds } });


    if (barangays.length !== barangayIds.length) {
      throw new BadRequestError("barangay not found");
    }

    return barangayRepository.batchUpdateBarangaysByIds(barangayIds, payload);
  }

  // SOFT DELETE OPERATIONS
  async softDeleteBarangay(barangayId: ObjectId) {
    const result = await barangayRepository.findSoftDeletedBarangayById(barangayId);

    console.log(result);

    if (!result) {
      throw new BadRequestError("barangay not found");
    }

    return barangayRepository.softDeleteBarangaysByFilters({ _id: barangayId });
  }

  async batchSoftDeleteBarangays(barangayIds: ObjectId[] | string[]) {
    const barangays = await barangayRepository.findAllBarangays({ _id: { $in: barangayIds } });

    if (barangays.length !== barangayIds.length) {
      throw new BadRequestError("barangay not found");
    }

    return barangayRepository.batchSoftDeleteBarangays(barangayIds);
  }

  async restoreSoftDeletedBarangay(barangayId: ObjectId | string) {
    const credentials = await barangayRepository.findSoftDeletedBarangayById(
      barangayId,
      "_id"
    );

    if (!credentials) {
      throw new BadRequestError("barangay not found");
    }

    const result = await barangayRepository.restoreSoftDeletedBarangayById(barangayId);

    if (!result) {
      throw new BadRequestError('Failed to restore barangay');
    }

    return result;
  }

  // HARD DELETE OPERATIONS
  async hardDeleteBarangay(barangayId: ObjectId) {
    const _barangay = await barangayRepository.findBarangayById(barangayId);

    if (!_barangay) {
      throw new BadRequestError("barangay not found");
    }

    return barangayRepository.hardDeleteBarangayById(barangayId);
  }
}

export default new BarangayService();

  