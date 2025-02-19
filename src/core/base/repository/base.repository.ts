import {
  FilterQuery,
  Model,
  Document,
  ObjectId,
  PopulateOptions,
  UpdateQuery,
} from "mongoose";
import {
  PaginatedResponse,
  PaginationOptions,
  PaginationParams,
  QueryOptions,
  UpdateQueryOptions,
} from "../types/query.types";

export interface SoftDeleteFields {
  isDeleted: boolean;
  deletedAt?: Date;
}

export abstract class BaseRepository<T extends Document & SoftDeleteFields> {
  public readonly modelName: string;

  constructor(protected readonly model: Model<T>) {
    this.modelName = model.modelName;
  }

  /**
   * Find all items
   * @param filters - The filters to apply to the query
   * @param options - The options to apply to the query
   * @returns The items found
   */
  async findAll(
    filters: FilterQuery<T>,
    options: QueryOptions = {}
  ): Promise<T[]> {
    return this.buildQuery(filters, options).lean() as Promise<T[]>;
  }

  /**
   * Find all soft deleted items
   * @param filters - The filters to apply to the query
   * @param options - The options to apply to the query
   * @returns The items found
   */
  async findAllSoftDeleted(
    filters: FilterQuery<T>,
    options: QueryOptions = {}
  ): Promise<T[]> {
    return this.buildQuery(filters, options).lean() as Promise<T[]>;
  }

  /**
   * Find an item by id
   * @param id - The id of the item to find
   * @param options - The options to apply to the query
   * @returns The item found
   */
  async findById(
    id: ObjectId | string,
    options: QueryOptions = {}
  ): Promise<T | null> {
    return this.buildQuery({ _id: id }, options)
      .findOne()
      .lean() as Promise<T | null>;
  }

  /**
   * Find an item by filters
   * @param filters - The filters to apply to the query
   * @param options - The options to apply to the query
   * @returns The item found
   */
  async findByFilters(
    filters: FilterQuery<T>,
    options: QueryOptions = {}
  ): Promise<T | null> {
    return this.buildQuery(filters, options)
      .findOne()
      .lean() as Promise<T | null>;
  }

  /**
   * Find a soft deleted item by id
   * @param id - The id of the item to find
   * @param options - The options to apply to the query
   * @returns The item found
   */
  async findSoftDeletedById(
    id: ObjectId | string,
    options: QueryOptions = {}
  ): Promise<T | null> {
    return this.buildQuery({ _id: id, isDeleted: true }, options)
      .findOne()
      .lean() as Promise<T | null>;
  }

  /**
   * Find a soft deleted item by filters
   * @param filters - The filters to apply to the query
   * @param options - The options to apply to the query
   * @returns The item found
   */
  async findSoftDeletedByFilters(
    filters: FilterQuery<T>,
    options: QueryOptions = {}
  ): Promise<T | null> {
    return this.buildQuery({ ...filters, isDeleted: true }, options)
      .findOne()
      .lean() as Promise<T | null>;
  }

  /**
   * Find paginated items
   * @param filters - The filters to apply to the query
   * @param select - The fields to select
   * @param pagination - The pagination options
   * @returns The paginated items
   */
  async findPaginated(
    filters: FilterQuery<T>,
    pagination?: PaginationParams,
    options?: PaginationOptions
  ): Promise<PaginatedResponse<T>> {
    const { effectivePage, effectiveLimit, skip, sort } =
      this.buildPaginationParams(pagination);

    console.log(filters);
    const [docs, total] = await Promise.all([
      this.buildQuery(filters, { ...options, sort })
        .skip(skip)
        .limit(effectiveLimit)
        .lean(),
      this.model.countDocuments(filters),
    ]);

    return {
      data: docs as T[],
      pagination: {
        total,
        page: effectivePage,
        limit: effectiveLimit,
        pages: Math.ceil(total / effectiveLimit),
      },
    };
  }

  /**
   * Create an item
   * @param data - The data to create the item with
   * @returns The item created
   */
  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  /**
   * Create multiple items
   * @param data - The data to create the items with
   * @returns The items created
   */
  async createMany(data: Partial<T>[]): Promise<T[]> {
    const docs = await this.model.insertMany(data);
    return docs as any as T[];
  }

  /**
   * Update an item
   * @param filters - The filters to apply to the query
   * @param data - The data to update the item with
   * @param select - The fields to select
   * @returns The item updated
   */
  async update(
    filters: FilterQuery<T>,
    data: UpdateQuery<T>,
    options: UpdateQueryOptions
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filters, data, { new: true })
      .lean()
      .select(options.select ?? "");
  }

  /**
   * Update multiple items
   * @param filters - The filters to apply to the query
   * @param update - The data to update the items with
   * @returns The items updated
   */
  protected async batchUpdate(
    filters: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: UpdateQueryOptions = {}
  ): Promise<any> {
    return this.model.updateMany(filters, update).select(options.select ?? "");
  }

  /**
   * Update multiple items by ids
   * @param ids - The ids of the items to update
   * @param data - The data to update the items with
   * @returns The items updated
   */
  async batchUpdateByIds(
    ids: (ObjectId | string)[],
    data: UpdateQuery<T>,
    options: UpdateQueryOptions = {}
  ): Promise<any> {
    return this.batchUpdate({ _id: { $in: ids } }, data, options);
  }

  /**
   * Soft delete an item by id
   * @param id - The id of the item to soft delete
   * @returns The item deleted
   */
  async softDeleteById(
    id: ObjectId,
    options: UpdateQueryOptions = {}
  ): Promise<T | null> {
    return this.performSoftDelete({ _id: id }, options);
  }

  /**
   * Soft delete an item by filters
   * @param filters - The filters to apply to the query
   * @returns The items deleted
   */
  async softDeleteByFilters(filters: FilterQuery<T>): Promise<any> {
    return this.performSoftDelete(filters, { batch: true });
  }

  /**
   * Soft delete multiple items
   * @param ids - The ids of the items to soft delete
   * @returns The items deleted
   */
  async batchSoftDelete(ids: (ObjectId | string)[]): Promise<any> {
    return this.performSoftDelete({ _id: { $in: ids } }, { batch: true });
  }

  /**
   * Hard delete an item by id
   * @param id - The id of the item to hard delete
   * @returns The item deleted
   */
  protected async performHardDelete(
    filters: FilterQuery<T>,
    options: { batch: boolean; select?: string } = { batch: false }
  ): Promise<T | null | any> {
    return options.batch
      ? this.model.deleteMany(filters)
      : this.model
          .findOneAndDelete(filters)
          .lean()
          .select(options.select ?? "");
  }

  /**
   * Hard delete an item by id
   * @param id - The id of the item to hard delete
   * @returns The item deleted
   */
  async hardDeleteById(id: ObjectId | string): Promise<T | null> {
    return this.performHardDelete({ _id: id, isDeleted: true });
  }

  /**
   * Hard delete an item by filters
   * @param filters - The filters to apply to the query
   * @returns The items deleted
   */
  async hardDeleteByFilters(filters: FilterQuery<T>): Promise<any> {
    return this.performHardDelete(filters, { batch: true });
  }

  /**
   * Hard delete multiple items
   * @param ids - The ids of the items to hard delete
   * @returns The items deleted
   */
  async batchHardDelete(ids: (ObjectId | string)[]): Promise<any> {
    return this.performHardDelete(
      { _id: { $in: ids }, isDeleted: true },
      { batch: true }
    );
  }

  /**
   * Restore an item by id
   * @param id - The id of the item to restore
   * @param options - The options to apply to the query
   * @returns The item restored
   */
  async restoreById(
    id: ObjectId | string,
    options: UpdateQueryOptions
  ): Promise<any> {
    return this.performRestore({ _id: id }, options);
  }

  /**
   * Restore an item by filters
   * @param filters - The filters to apply to the query
   * @returns The items restored
   */
  async restoreByFilters(filters: FilterQuery<T>): Promise<any> {
    return this.performRestore(filters, { batch: true });
  }

  /**
   * Restore multiple items
   * @param ids - The ids of the items to restore
   * @returns The items restored
   */
  async batchRestore(ids: (ObjectId | string)[]): Promise<any> {
    return this.performRestore({ _id: { $in: ids } }, { batch: true });
  }

  // Helper Methods

  /**
   * Build a query
   * @param baseQuery - The base query
   * @param options - The options to apply to the query
   * @param includeDeleted - Whether to include deleted items
   * @returns The query
   */
  protected buildQuery(baseQuery: FilterQuery<T>, options: QueryOptions = {}) {
    const query = this.model.find(baseQuery);

    if (options.select) query.select(options.select);
    if (options.populate) query.populate(options.populate as PopulateOptions);
    if (options.sort) query.sort(options.sort);

    return query;
  }

  /**
   * Build pagination parameters
   * @param pagination - The pagination options
   * @returns The pagination parameters
   */
  protected buildPaginationParams(pagination?: PaginationParams) {
    const effectivePage = Math.max(1, pagination?.page ?? 1);
    const effectiveLimit = Math.max(1, pagination?.limit ?? 10);
    const skip = (effectivePage - 1) * effectiveLimit;
    const sort = pagination?.sort ?? { createdAt: -1 };

    return { effectivePage, effectiveLimit, skip, sort };
  }

  /**
   * Perform a soft delete
   * @param filters - The filters to apply to the query
   * @param options - The options to apply to the query
   * @returns The item deleted
   */
  protected async performSoftDelete(
    filters: FilterQuery<T>,
    options: UpdateQueryOptions = {}
  ): Promise<T | null | any> {
    const update = {
      isDeleted: true,
      deletedAt: new Date(),
    } as UpdateQuery<T>;

    return options.batch
      ? this.batchUpdate(filters, update, {
          select: options.select ?? "",
        })
      : this.update({ ...filters, isDeleted: false }, update, options);
  }

  protected async performRestore(
    filters: FilterQuery<T>,
    options: UpdateQueryOptions = {}
  ): Promise<any> {
    const update = {
      $set: {
        isDeleted: false,
        deletedAt: null,
      },
    };

    return this.batchUpdate({ ...filters, isDeleted: true }, update, options);
  }
}
