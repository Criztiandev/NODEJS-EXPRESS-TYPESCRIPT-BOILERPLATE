import { FilterQuery, Model, Document, ObjectId, SortOrder } from "mongoose";

export interface PaginationParams {
  page?: number;
  limit?: number;
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

  async findPaginated(
    filters: FilterQuery<T>,
    select?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const { effectivePage, effectiveLimit, skip } =
      this.buildPaginationParams(pagination);

    const [docs, total] = await Promise.all([
      this.model
        .find(filters)
        .skip(skip)
        .limit(effectiveLimit)
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
    return this.findPaginated(
      { ...filters, isDeleted: true },
      select,
      pagination
    );
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

    return { effectivePage, effectiveLimit, skip };
  }
}
