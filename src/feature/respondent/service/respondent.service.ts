
  import { FilterQuery, ObjectId } from "mongoose";
import respondentRepository from "../repository/respondent.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { Respondent } from "../interface/respondent.interface";
import { QueryParams } from "../../../interface/pagination.interface";


class RespondentService {
  // FIND OPERATIONS
  async getPaginatedRespondents(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Respondent> = {};

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

    return respondentRepository.findPaginatedRespondents(filters, undefined, page, limit);
  }

  async getPaginatedSoftDeletedRespondents(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<Respondent> = {
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

    return respondentRepository.findPaginatedRespondents(filters, undefined, page, limit);
  }

  async getRespondent(respondentId: ObjectId | string) {
    const credentials = await respondentRepository.findRespondentById(respondentId);

    if (!credentials) {
      throw new BadRequestError("respondent not found");
    }

    return credentials;
  }

  async getRespondentByFilters(filters: FilterQuery<Respondent>) {
    const credentials = await respondentRepository.findAllRespondents(filters);

    if (!credentials) {
      throw new BadRequestError("respondent not found");
    }

    return credentials;
  }

  async getSoftDeletedRespondent(respondentId: ObjectId | string) {
    console.log(await respondentRepository.findSoftDeletedRespondentById(respondentId));
    const credentials = await respondentRepository.findSoftDeletedRespondentById(respondentId);

    if (!credentials) {
      throw new BadRequestError("respondent not found");
    }

    return credentials;
  }

  // CREATE OPERATIONS
  async createRespondent(payload: Respondent) {
    const credentials = await respondentRepository.findRespondentById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("Respondent already exists");
    }

    return respondentRepository.createRespondent(payload);
  }

  // UPDATE OPERATIONS
  async updateRespondent(id: ObjectId | string, payload: Respondent) {
    const credentials = await respondentRepository.findRespondentById(id);

    if (!credentials) {
      throw new BadRequestError("respondent not found");
    }

    return respondentRepository.updateRespondentByFilters({ _id: id }, payload);
  }

  async batchUpdateRespondentsById(respondentIds: ObjectId[] | string[], payload: Respondent) {
    const respondents = await respondentRepository.findAllRespondents({ _id: { $in: respondentIds } });


    if (respondents.length !== respondentIds.length) {
      throw new BadRequestError("respondent not found");
    }

    return respondentRepository.batchUpdateRespondentsByIds(respondentIds, payload);
  }

  // SOFT DELETE OPERATIONS
  async softDeleteRespondent(respondentId: ObjectId) {
    const result = await respondentRepository.findSoftDeletedRespondentById(respondentId);

    console.log(result);

    if (!result) {
      throw new BadRequestError("respondent not found");
    }

    return respondentRepository.softDeleteRespondentsByFilters({ _id: respondentId });
  }

  async batchSoftDeleteRespondents(respondentIds: ObjectId[] | string[]) {
    const respondents = await respondentRepository.findAllRespondents({ _id: { $in: respondentIds } });

    if (respondents.length !== respondentIds.length) {
      throw new BadRequestError("respondent not found");
    }

    return respondentRepository.batchSoftDeleteRespondents(respondentIds);
  }

  async restoreSoftDeletedRespondent(respondentId: ObjectId | string) {
    const credentials = await respondentRepository.findSoftDeletedRespondentById(
      respondentId,
      "_id"
    );

    if (!credentials) {
      throw new BadRequestError("respondent not found");
    }

    const result = await respondentRepository.restoreSoftDeletedRespondentById(respondentId);

    if (!result) {
      throw new BadRequestError('Failed to restore respondent');
    }

    return result;
  }

  // HARD DELETE OPERATIONS
  async hardDeleteRespondent(respondentId: ObjectId) {
    const _respondent = await respondentRepository.findRespondentById(respondentId);

    if (!_respondent) {
      throw new BadRequestError("respondent not found");
    }

    return respondentRepository.hardDeleteRespondentById(respondentId);
  }
}

export default new RespondentService();

  