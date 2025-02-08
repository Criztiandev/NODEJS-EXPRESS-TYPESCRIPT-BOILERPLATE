export const repositoryTemplate = (name: string) => {
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return `
import { FilterQuery, ObjectId } from "mongoose";
import ${name}Model from "../../../model/${name}.model";
import { ${capitalizedName} } from "../interface/${name}.interface";

class ${capitalizedName}Repository {
  async findAll${capitalizedName}s(filters: FilterQuery<${capitalizedName}>, select?: string) {
    return await ${name}Model
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async find${capitalizedName}ById(${name}Id: ObjectId | string, select?: string) {
    return ${name}Model
      .findById(${name}Id)
      .lean()
      .select(select ?? "");
  }

  async findPaginated${capitalizedName}s(
    filters: FilterQuery<${capitalizedName}>,
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
      ${name}Model
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      ${name}Model.countDocuments(filters),
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

  async findSoftDeleted${capitalizedName}ById(${name}Id: ObjectId | string, select?: string) {
    return ${name}Model
      .findOne({ _id: ${name}Id, isDeleted: true })
      .lean()
      .select(select ?? "");
  }

  async findPaginatedSoftDeleted${capitalizedName}s(
    filters: FilterQuery<${capitalizedName}>,
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
      ${name}Model
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .lean()
        .select(select ?? ""),
      ${name}Model.countDocuments(filters),
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

  async create${capitalizedName}(credentials: ${capitalizedName}) {
    return await ${name}Model.create(credentials);
  }

  async update${capitalizedName}ByFilters(
    filters: FilterQuery<${capitalizedName}>,
    credentials: ${capitalizedName},
    select?: string
  ) {
    return await ${name}Model
      .findOneAndUpdate(filters, credentials, {
        new: true,
      })
      .lean()
      .select(select ?? "");
  }

  async batchUpdate${capitalizedName}sByIds(
    ${name}Ids: ObjectId[] | string[],
    credentials: ${capitalizedName}
  ) {
    return await ${name}Model.updateMany({ _id: { $in: ${name}Ids } }, credentials);
  }

  async softDelete${capitalizedName}sByFilters(filters: FilterQuery<${capitalizedName}>) {
    return await ${name}Model.updateMany(filters, { isDeleted: true });
  }

  async batchSoftDelete${capitalizedName}s(${name}Ids: ObjectId[] | string[]) {
    return await ${name}Model.updateMany(
      { _id: { $in: ${name}Ids }, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreSoftDeleted${capitalizedName}ById(${name}Id: ObjectId | string) {
    return await ${name}Model.findOneAndUpdate(
      { _id: ${name}Id, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );
  }

  async hardDelete${capitalizedName}ById(${name}Id: ObjectId | string) {
    return await ${name}Model.findByIdAndDelete(${name}Id);
  }

  private buildPaginationParams(
    filters: FilterQuery<${capitalizedName}>,
    select?: string,
    page?: number,
    limit?: number
  ) {
    // If no page/limit provided, use defaults
    const effectivePage = page ?? 1;
    const effectiveLimit = limit ?? 10;
    const skip = (effectivePage - 1) * effectiveLimit;

    const query = ${name}Model.find(filters);

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

export default new ${capitalizedName}Repository();
  `;
};
