
  import { FilterQuery, ObjectId } from "mongoose";
import testModel, { Test } from "../../../model/test.model";

class TestRepository {
  async findAllTests(filters: FilterQuery<Test>, select?: string) {
    return await testModel
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findTestById(testId: ObjectId | string, select?: string) {
    return testModel
      .findById(testId)
      .lean()
      .select(select ?? "");
  }

  async findPaginatedTests(
    filters: FilterQuery<Test>,
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
      testModel
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      testModel.countDocuments(filters),
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

  async findSoftDeletedTestById(testId: ObjectId | string, select?: string) {
    return testModel
      .findOne({ _id: testId, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedSoftDeletedTests(
    filters: FilterQuery<Test>,
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
      testModel
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      testModel.countDocuments(filters),
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

  async createTest(credentials: Test) {
    return await testModel.create(credentials);
  }

  async updateTestByFilters(
    filters: FilterQuery<Test>,
    credentials: Test,
    select?: string
  ) {
    return await testModel
      .findOneAndUpdate(filters, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
  }

  async batchUpdateTestsByIds(
    testIds: ObjectId[] | string[],
    credentials: Test
  ) {
    return await testModel.updateMany({ _id: { $in: testIds } }, credentials);
  }

  async softDeleteTestsByFilters(filters: FilterQuery<Test>) {
    return await testModel.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDeleteTests(testIds: ObjectId[] | string[]) {
    return await testModel.updateMany(
      { _id: { $in: testIds }, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreSoftDeletedTestById(testId: ObjectId | string) {
    return await testModel.findOneAndUpdate(
      { _id: testId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async hardDeleteTestById(testId: ObjectId | string) {
    return await testModel.findByIdAndDelete(testId);
  }

  private buildPaginationParams(
    filters: FilterQuery<Test>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    // If no page/limit provided, use defaults
    const effectivePage = page ?? 1;
    const effectiveLimit = limit ?? 10;
    const skip = (effectivePage - 1) * effectiveLimit;

    const query = testModel.find(filters);

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

export default new TestRepository();
  