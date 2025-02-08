
  import { FilterQuery, ObjectId } from "mongoose";
import testRepository from "../repository/test.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { Test } from "../../../model/test.model";
import { QueryParams } from "../../../interface/pagination.interface";

class TestService {
  // FIND OPERATIONS
  async getPaginatedTests(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Test> = {};

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

    return testRepository.findPaginatedTests(filters, undefined, page, limit);
  }

  async getPaginatedSoftDeletedTests(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Test> = {
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

    return testRepository.findPaginatedTests(filters, undefined, page, limit);
  }

  async getTest(testId: ObjectId | string) {
    const credentials = await testRepository.findTestById(testId);

    if (!credentials) {
      throw new BadRequestError("test not found");
    }

    return credentials;
  }

  async getTestByFilters(filters: FilterQuery<Test>) {
    const credentials = await testRepository.findAllTests(filters);

    if (!credentials) {
      throw new BadRequestError("test not found");
    }

    return credentials;
  }

  async getSoftDeletedTest(testId: ObjectId | string) {
    console.log(await testRepository.findSoftDeletedTestById(testId));
    const credentials = await testRepository.findSoftDeletedTestById(testId);

    if (!credentials) {
      throw new BadRequestError("test not found");
    }

    return credentials;
  }

  // CREATE OPERATIONS
  async createTest(payload: Test) {
    const credentials = await testRepository.findTestById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("Test already exists");
    }

    return testRepository.createTest(payload);
  }

  // UPDATE OPERATIONS
  async updateTest(id: ObjectId | string, payload: Test) {
    const credentials = await testRepository.findTestById(id);

    if (!credentials) {
      throw new BadRequestError("test not found");
    }

    return testRepository.updateTestByFilters({ _id: id }, payload);
  }

  async batchUpdateTestsById(testIds: ObjectId[] | string[], payload: Test) {
    const tests = await testRepository.findAllTests({ _id: { $in: testIds } });


    if (tests.length !== testIds.length) {
      throw new BadRequestError("test not found");
    }

    return testRepository.batchUpdateTestsByIds(testIds, payload);
  }

  // SOFT DELETE OPERATIONS
  async softDeleteTest(testId: ObjectId) {
    const result = await testRepository.findSoftDeletedTestById(testId);

    console.log(result);

    if (!result) {
      throw new BadRequestError("test not found");
    }

    return testRepository.softDeleteTestsByFilters({ _id: testId });
  }

  async batchSoftDeleteTests(testIds: ObjectId[] | string[]) {
    const tests = await testRepository.findAllTests({ _id: { $in: testIds } });

    if (tests.length !== testIds.length) {
      throw new BadRequestError("test not found");
    }

    return testRepository.batchSoftDeleteTests(testIds);
  }

  async restoreSoftDeletedTest(testId: ObjectId | string) {
    const credentials = await testRepository.findSoftDeletedTestById(
      testId,
      "_id"
    );

    if (!credentials) {
      throw new BadRequestError("test not found");
    }

    const result = await testRepository.restoreSoftDeletedTestById(testId);

    if (!result) {
      throw new BadRequestError('Failed to restore test');
    }

    return result;
  }

  // HARD DELETE OPERATIONS
  async hardDeleteTest(testId: ObjectId) {
    const _test = await testRepository.findTestById(testId);

    if (!_test) {
      throw new BadRequestError("test not found");
    }

    return testRepository.hardDeleteTestById(testId);
  }
}

export default new TestService();

  