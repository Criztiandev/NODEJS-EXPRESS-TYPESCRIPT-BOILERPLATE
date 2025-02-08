
import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../../../utils/decorator.utils";
import testService from "../service/test.service";
import { ObjectId } from "mongoose";
import { QueryParams } from "../../../interface/pagination.interface";


class TestController {
  @AsyncHandler()
  async getTestDetails(req: Request, res: Response, next: NextFunction) {

    const { id: testId } = req.params;


    const testCredentials = await testService.getTest(testId);

    res.status(200).json({
      payload: testCredentials,
      message: "test retrieved successfully",
    });
  }

  @AsyncHandler()
  async getSoftDeletedTestDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: testId } = req.params;

    const testCredentials = await testService.getSoftDeletedTest(testId);

    res.status(200).json({
      payload: testCredentials,
      message: "test retrieved successfully",
    });
  }

  /**
   * Get all tests with pagination
   * /api/tests?search=urgent&status=open&priority=high
   * /api/tests?page=1&limit=10
   */
  @AsyncHandler()
  async getAllTests(req: Request, res: Response, next: NextFunction) {
    const queryParams: QueryParams = req.query as QueryParams;

    const testCredentials = await testService.getPaginatedTests(queryParams);

    res.status(200).json({
      payload: testCredentials,
      message: "tests retrieved successfully",
    });
  }

  @AsyncHandler()
  async getAllSoftDeletedTests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const queryParams: QueryParams = req.query as QueryParams;

    const testCredentials = await testService.getPaginatedSoftDeletedTests(
      queryParams
    );


    res.status(200).json({
      payload: testCredentials,
      message: "tests retrieved successfully",
    });
  }

  @AsyncHandler()
  async createTest(req: Request, res: Response, next: NextFunction) {
    const testCredentials = await testService.createTest(req.body);

    res.status(200).json({
      payload: testCredentials,
      message: "test created successfully",
    });
  }

  @AsyncHandler()
  async restoreSoftDeletedTest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: testId } = req.params;
    const testCredentials = await testService.restoreSoftDeletedTest(testId);

    res.status(200).json({
      payload: testCredentials,
      message: "test restored successfully",
    });
  }

  @AsyncHandler()
  async updateTest(req: Request, res: Response, next: NextFunction) {
    const { id: testId } = req.params;
    const testCredentials = await testService.updateTest(testId, req.body);

    res.status(200).json({
      payload: testCredentials,
      message: "test updated successfully",
    });
  }

  @AsyncHandler()
  async batchUpdateTests(req: Request, res: Response, next: NextFunction) {
    const { testIds, updateData } = req.body;

    const testCredentials = await testService.batchUpdateTestsById(
      testIds,
      updateData
    );

    res.status(200).json({
      payload: testCredentials,
      message: "tests updated successfully",
    });
  }

  @AsyncHandler()
  async softDeleteTest(req: Request, res: Response, next: NextFunction) {
    const { id: testId } = req.params;

    const testCredentials = await testService.softDeleteTest(
      testId as unknown as ObjectId
    );

    res.status(200).json({
      payload: testCredentials,
      message: "test deleted successfully",
    });
  }

  @AsyncHandler()
  async hardDeleteTest(req: Request, res: Response, next: NextFunction) {
    const { testId } = req.params;
    const testCredentials = await testService.hardDeleteTest(
      testId as unknown as ObjectId
    );

    res.status(200).json({
      payload: testCredentials,
      message: "test deleted successfully",
    });
  }

  @AsyncHandler()
  async batchSoftDeleteTests(req: Request, res: Response, next: NextFunction) {
    const { testIds } = req.body;
    const testCredentials = await testService.batchSoftDeleteTests(testIds);

    res.status(200).json({
      payload: testCredentials,
      message: "tests soft deleted successfully",
    });
  }
}

export default new TestController();
