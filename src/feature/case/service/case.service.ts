import { FilterQuery, ObjectId } from "mongoose";
import caseRepository from "../repository/case.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { Case } from "../../../model/case.model";
import { QueryParams } from "../../../interface/pagination.interface";

class CaseService {
  // FIND OPERATIONS
  async getPaginatedCases(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Case> = {};

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

    return caseRepository.findPaginatedCases(filters, undefined, page, limit);
  }

  async getPaginatedSoftDeletedCases(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Case> = {
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

    return caseRepository.findPaginatedCases(filters, undefined, page, limit);
  }

  async getCase(caseId: ObjectId | string) {
    const credentials = await caseRepository.findCaseById(caseId);

    if (!credentials) {
      throw new BadRequestError("Case not found");
    }

    return credentials;
  }

  async getCaseByFilters(filters: FilterQuery<Case>) {
    const credentials = await caseRepository.findAllCases(filters);

    if (!credentials) {
      throw new BadRequestError("Case not found");
    }

    return credentials;
  }

  async getSoftDeletedCase(caseId: ObjectId | string) {
    console.log(await caseRepository.findSoftDeletedCaseById(caseId));
    const credentials = await caseRepository.findSoftDeletedCaseById(caseId);

    if (!credentials) {
      throw new BadRequestError("Case not found");
    }

    return credentials;
  }

  // CREATE OPERATIONS
  async createCase(payload: Case) {
    const credentials = await caseRepository.findCaseById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("Case already exists");
    }

    return caseRepository.createCase(payload);
  }

  // UPDATE OPERATIONS
  async updateCase(id: ObjectId | string, payload: Case) {
    const credentials = await caseRepository.findCaseById(id);

    if (!credentials) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.updateCaseByFilters({ _id: id }, payload);
  }

  async batchUpdateCasesById(caseIds: ObjectId[] | string[], payload: Case) {
    const cases = await caseRepository.findAllCases({ _id: { $in: caseIds } });

    if (cases.length !== caseIds.length) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.batchUpdateCasesByIds(caseIds, payload);
  }

  // SOFT DELETE OPERATIONS
  async softDeleteCase(caseId: ObjectId) {
    const result = await caseRepository.findSoftDeletedCaseById(caseId);

    console.log(result);

    if (!result) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.softDeleteCasesByFilters({ _id: caseId });
  }

  async batchSoftDeleteCases(caseIds: ObjectId[] | string[]) {
    const cases = await caseRepository.findAllCases({ _id: { $in: caseIds } });

    if (cases.length !== caseIds.length) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.batchSoftDeleteCases(caseIds);
  }

  async restoreSoftDeletedCase(caseId: ObjectId | string) {
    const credentials = await caseRepository.findSoftDeletedCaseById(
      caseId,
      "_id"
    );

    if (!credentials) {
      throw new BadRequestError("Case not found");
    }

    const result = await caseRepository.restoreSoftDeletedCaseById(caseId);

    if (!result) {
      throw new BadRequestError(`Failed to restore case ${credentials._id}`);
    }

    return result;
  }

  // HARD DELETE OPERATIONS
  async hardDeleteCase(caseId: ObjectId) {
    const _case = await caseRepository.findCaseById(caseId);

    if (!_case) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.hardDeleteCaseById(caseId);
  }
}

export default new CaseService();
