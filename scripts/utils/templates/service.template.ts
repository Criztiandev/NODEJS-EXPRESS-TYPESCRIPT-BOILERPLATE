export const serviceTemplate = `
import { FilterQuery, ObjectId } from "mongoose";
import caseRepository from "../repository/case.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { Case } from "../../../model/case.model";

class CaseService {
  async getAllCases(filters: FilterQuery<Case>, select?: string) {
    return caseRepository.findAllCases(filters, select);
  }

  async getPaginatedCases(
    filters: FilterQuery<Case>,
    select?: string,
    page: number = 1,
    limit: number = 10
  ) {
    return caseRepository.findPaginatedCases(filters, select, page, limit);
  }

  async getAllSoftDeletedCases(filters: FilterQuery<Case>, select?: string) {
    return caseRepository.findAllSoftDeletedCases(filters, select);
  }

  async getPaginatedSoftDeletedCases(
    filters: FilterQuery<Case>,
    select?: string,
    page: number = 1,
    limit: number = 10
  ) {
    return caseRepository.findPaginatedSoftDeletedCases(
      filters,
      select,
      page,
      limit
    );
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
    const credentials = await caseRepository.findSoftDeletedCaseById(caseId);

    if (!credentials) {
      throw new BadRequestError("Case not found");
    }

    return credentials;
  }

  async createCase(payload: Case) {
    const credentials = await caseRepository.findCaseById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("Case already exists");
    }

    return caseRepository.createCase(payload);
  }

  async updateCase(id: ObjectId | string, payload: Case) {
    const credentials = await caseRepository.findCaseById(id);

    if (!credentials) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.updateCaseById(id, payload);
  }

  async batchUpdateCases(caseIds: ObjectId[] | string[], payload: Case) {
    const cases = await caseRepository.findAllCases({ _id: { $in: caseIds } });

    if (cases.length !== caseIds.length) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.batchUpdateCasesByIds(caseIds, payload);
  }

  async softDeleteCase(caseId: ObjectId) {
    const _case = await caseRepository.findCaseById(caseId);

    if (!_case) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.softDeleteCaseById(caseId);
  }

  async batchSoftDeleteCases(caseIds: ObjectId[] | string[]) {
    const cases = await caseRepository.findAllCases({ _id: { $in: caseIds } });

    if (cases.length !== caseIds.length) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.batchSoftDeleteCases(caseIds);
  }

  async hardDeleteCase(caseId: ObjectId) {
    const _case = await caseRepository.findCaseById(caseId);

    if (!_case) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.hardDeleteCaseById(caseId);
  }

  async batchHardDeleteCases(caseIds: ObjectId[] | string[]) {
    const cases = await caseRepository.findAllCases({ _id: { $in: caseIds } });

    if (cases.length !== caseIds.length) {
      throw new BadRequestError("Case not found");
    }

    return caseRepository.batchHardDeleteCases(caseIds);
  }
}

export default new CaseService();
`;
