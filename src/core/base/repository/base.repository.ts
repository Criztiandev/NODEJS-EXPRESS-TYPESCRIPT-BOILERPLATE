import {
  FilterQuery,
  Model,
  Document,
  ObjectId,
  SortOrder,
  PopulateOptions,
} from "mongoose";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: Record<string, SortOrder>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface SoftDeleteFields {
  isDeleted: boolean;
  deletedAt?: Date;
}

interface FindByFilterOptions extends PaginationParams {
  select?: string | Record<string, number>;
  sort?: Record<string, SortOrder>;
}

interface FindOptions {
  select?: string | Record<string, number>;
  sort?: Record<string, SortOrder>;
  populate?: PopulateOptions | (string | PopulateOptions)[];
}

export abstract class BaseRepository<T extends Document & SoftDeleteFields> {
  constructor(protected readonly model: Model<T>) {}

  async findAll(filters: FilterQuery<T>, select?: string): Promise<T[]> {
    return this.model
      .find(filters)
      .lean()
      .select(select ?? "");
  }

  async findById(id: ObjectId | string, select?: string): Promise<T | null> {
    return this.model
      .findById(id)
      .lean()
      .select(select ?? "");
  }

  async findByFilters(
    filters: FilterQuery<T>,
    options: FindOptions = {}
  ): Promise<T[]> {
    const query = this.model.find(filters);

    if (options.select) query.select(options.select);
    if (options.populate) query.populate(options.populate);
    if (options.sort) query.sort(options.sort);

    return query.lean() as Promise<T[]>;
  }

  async findPaginated(
    filters: FilterQuery<T>,
    select?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const { effectivePage, effectiveLimit, skip, sort } =
      this.buildPaginationParams(pagination);

    const [docs, total] = await Promise.all([
      this.model
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
        .sort(sort)
        .lean()
        .select(select ?? ""),
      this.model.countDocuments(filters),
    ]);

    return {
      data: docs as any[] as T[],
      pagination: {
        total,
        page: effectivePage,
        limit: effectiveLimit,
        pages: Math.ceil(total / effectiveLimit),
      },
    };
  }

  async findPaginatedSoftDeleted(
    filters: FilterQuery<T>,
    select?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const { effectivePage, effectiveLimit, skip, sort } =
      this.buildPaginationParams(pagination);

    const [docs, total] = await Promise.all([
      this.model
        .find({ ...filters, isDeleted: true })
        .skip(skip)
        .limit(effectiveLimit)
        .sort(sort)
        .lean()
        .select(select ?? ""),
      this.model.countDocuments(filters),
    ]);

    return {
      data: docs as any[] as T[],
      pagination: {
        total,
        page: effectivePage,
        limit: effectiveLimit,
        pages: Math.ceil(total / effectiveLimit),
      },
    };
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    const docs = await this.model.insertMany(data);
    return docs as unknown as T[];
  }

  async updateByFilters(
    filters: FilterQuery<T>,
    data: Partial<T>,
    select?: string
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filters, data, { new: true })
      .lean()
      .select(select ?? "");
  }

  async batchUpdateByIds(
    ids: (ObjectId | string)[],
    data: Partial<T>
  ): Promise<any> {
    return this.model.updateMany({ _id: { $in: ids } }, data);
  }

  async softDeleteById(id: ObjectId | string): Promise<T | null> {
    return this.model.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      } as Partial<T>,
      { new: true }
    );
  }

  async softDeleteByFilters(filters: FilterQuery<T>): Promise<any> {
    return this.model.updateMany(filters, {
      isDeleted: true,
      deletedAt: new Date(),
    } as Partial<T>);
  }

  async batchSoftDelete(ids: (ObjectId | string)[]): Promise<any> {
    return this.model.updateMany({ _id: { $in: ids } }, {
      isDeleted: true,
      deletedAt: new Date(),
    } as Partial<T>);
  }

  async hardDeleteById(id: ObjectId | string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async hardDeleteByFilters(filters: FilterQuery<T>): Promise<any> {
    return this.model.deleteMany(filters);
  }

  async batchHardDelete(ids: (ObjectId | string)[]): Promise<any> {
    return this.model.deleteMany({ _id: { $in: ids } });
  }

  async restore(filters: FilterQuery<T>): Promise<any> {
    return this.model.updateMany(filters, {
      $set: {
        isDeleted: false,
        deletedAt: null,
      },
    });
  }

  async batchRestore(ids: (ObjectId | string)[]): Promise<any> {
    return this.model.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
        },
      }
    );
  }

  protected buildPaginationParams(pagination?: PaginationParams) {
    const effectivePage = Math.max(1, pagination?.page ?? 1);
    const effectiveLimit = Math.max(1, pagination?.limit ?? 10);
    const skip = (effectivePage - 1) * effectiveLimit;
    const _sort = pagination?.sort ?? { createdAt: -1 };

    return { effectivePage, effectiveLimit, skip, sort: _sort };
  }
}
