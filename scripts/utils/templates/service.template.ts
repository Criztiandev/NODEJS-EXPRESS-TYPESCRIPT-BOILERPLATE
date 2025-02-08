export const serviceTemplate = (name: string) => {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return `
  import { FilterQuery, ObjectId } from "mongoose";
import ${name}Repository from "../repository/${name}.repository";
import { BadRequestError } from "../../../utils/error.utils";
import { ${capitalizedName} } from "../interface/${name}.interface";
import { QueryParams } from "../../../interface/pagination.interface";


class ${capitalizedName}Service {
  // FIND OPERATIONS
  async getPaginated${capitalizedName}s(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<${capitalizedName}> = {};

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

    return ${name}Repository.findPaginated${capitalizedName}s(filters, undefined, page, limit);
  }

  async getPaginatedSoftDeleted${capitalizedName}s(queryParams: QueryParams) {
    // Extract pagination params
    const page = queryParams.page ? parseInt(queryParams.page) : undefined;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : undefined;

    const filters: FilterQuery<${capitalizedName}> = {
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

    return ${name}Repository.findPaginated${capitalizedName}s(filters, undefined, page, limit);
  }

  async get${capitalizedName}(${name}Id: ObjectId | string) {
    const credentials = await ${name}Repository.find${capitalizedName}ById(${name}Id);

    if (!credentials) {
      throw new BadRequestError("${name} not found");
    }

    return credentials;
  }

  async get${capitalizedName}ByFilters(filters: FilterQuery<${capitalizedName}>) {
    const credentials = await ${name}Repository.findAll${capitalizedName}s(filters);

    if (!credentials) {
      throw new BadRequestError("${name} not found");
    }

    return credentials;
  }

  async getSoftDeleted${capitalizedName}(${name}Id: ObjectId | string) {
    console.log(await ${name}Repository.findSoftDeleted${capitalizedName}ById(${name}Id));
    const credentials = await ${name}Repository.findSoftDeleted${capitalizedName}ById(${name}Id);

    if (!credentials) {
      throw new BadRequestError("${name} not found");
    }

    return credentials;
  }

  // CREATE OPERATIONS
  async create${capitalizedName}(payload: ${capitalizedName}) {
    const credentials = await ${name}Repository.find${capitalizedName}ById(
      payload._id as ObjectId
    );

    if (credentials) {
      throw new BadRequestError("${capitalizedName} already exists");
    }

    return ${name}Repository.create${capitalizedName}(payload);
  }

  // UPDATE OPERATIONS
  async update${capitalizedName}(id: ObjectId | string, payload: ${capitalizedName}) {
    const credentials = await ${name}Repository.find${capitalizedName}ById(id);

    if (!credentials) {
      throw new BadRequestError("${name} not found");
    }

    return ${name}Repository.update${capitalizedName}ByFilters({ _id: id }, payload);
  }

  async batchUpdate${capitalizedName}sById(${name}Ids: ObjectId[] | string[], payload: ${capitalizedName}) {
    const ${name}s = await ${name}Repository.findAll${capitalizedName}s({ _id: { $in: ${name}Ids } });


    if (${name}s.length !== ${name}Ids.length) {
      throw new BadRequestError("${name} not found");
    }

    return ${name}Repository.batchUpdate${capitalizedName}sByIds(${name}Ids, payload);
  }

  // SOFT DELETE OPERATIONS
  async softDelete${capitalizedName}(${name}Id: ObjectId) {
    const result = await ${name}Repository.findSoftDeleted${capitalizedName}ById(${name}Id);

    console.log(result);

    if (!result) {
      throw new BadRequestError("${name} not found");
    }

    return ${name}Repository.softDelete${capitalizedName}sByFilters({ _id: ${name}Id });
  }

  async batchSoftDelete${capitalizedName}s(${name}Ids: ObjectId[] | string[]) {
    const ${name}s = await ${name}Repository.findAll${capitalizedName}s({ _id: { $in: ${name}Ids } });

    if (${name}s.length !== ${name}Ids.length) {
      throw new BadRequestError("${name} not found");
    }

    return ${name}Repository.batchSoftDelete${capitalizedName}s(${name}Ids);
  }

  async restoreSoftDeleted${capitalizedName}(${name}Id: ObjectId | string) {
    const credentials = await ${name}Repository.findSoftDeleted${capitalizedName}ById(
      ${name}Id,
      "_id"
    );

    if (!credentials) {
      throw new BadRequestError("${name} not found");
    }

    const result = await ${name}Repository.restoreSoftDeleted${capitalizedName}ById(${name}Id);

    if (!result) {
      throw new BadRequestError('Failed to restore ${name}');
    }

    return result;
  }

  // HARD DELETE OPERATIONS
  async hardDelete${capitalizedName}(${name}Id: ObjectId) {
    const _${name} = await ${name}Repository.find${capitalizedName}ById(${name}Id);

    if (!_${name}) {
      throw new BadRequestError("${name} not found");
    }

    return ${name}Repository.hardDelete${capitalizedName}ById(${name}Id);
  }
}

export default new ${capitalizedName}Service();

  `;
};
