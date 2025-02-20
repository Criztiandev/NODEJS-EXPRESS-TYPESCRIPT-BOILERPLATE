import { FilterQuery, Document, ObjectId, SortOrder } from "mongoose";
import { BadRequestError } from "../../../utils/error.utils";
import {
  BaseRepository,
  SoftDeleteFields,
} from "../repository/base.repository";
import {
  QueryOptions,
  PaginatedResponse,
  PaginationQueryParams,
  ValidateOptions,
} from "../types/query.types";

export interface ExtendedQueryOptions extends QueryOptions {
  searchableFields?: string[];
  defaultFilters?: FilterQuery<any>;
}

export abstract class BaseService<T extends Document & SoftDeleteFields> {
  protected readonly modelName: string;

  constructor(protected readonly repository: BaseRepository<T>) {
    if (!repository) {
      throw new BadRequestError("Repository is required");
    }
    this.modelName = repository.modelName;
  }

  /**
   * Find paginated items
   * @param params - The pagination query params
   * @param options - The extended query options
   * @returns The paginated items
   */
  async getPaginatedService(
    params: PaginationQueryParams,
    options: ExtendedQueryOptions = {}
  ): Promise<PaginatedResponse<T>> {
    const filters = this.buildFilters(params, options);
    const sort = this.buildSortCriteria(params);

    return this.repository.findPaginated(
      filters,
      { page: params.page, limit: params.limit, sort },
      { select: options.select, populate: options.populate }
    );
  }

  /**
   * Find an item by id
   * @param id - The id of the item to find
   * @param options - The query options
   * @returns The item found
   */
  async getByIdService(
    id: ObjectId | string,
    options: QueryOptions = {}
  ): Promise<T> {
    const item = await this.repository.findById(id, options);

    if (!item) {
      throw new BadRequestError(`${this.modelName} not found`);
    }
    return item;
  }

  async getAllByIdsService(ids: ObjectId[] | string[]): Promise<T[]> {
    const items = await this.repository.findAll({ _id: { $in: ids } });
    return items;
  }

  async getAllByFiltersService(filters: FilterQuery<T>): Promise<T[]> {
    const items = await this.repository.findByFilters(filters);
    return items ?? [];
  }

  /**
   * Find a soft deleted item by id
   * @param id - The id of the item to find
   * @param options - The query options
   * @returns The item found
   */
  async getSoftDeletedByIdService(
    id: ObjectId | string,
    options: QueryOptions = {}
  ): Promise<T> {
    const item = await this.repository.findSoftDeletedById(id, options);

    if (!item) {
      throw new BadRequestError(`${this.modelName} not found`);
    }

    return item;
  }

  /**
   * Create an item
   * @param payload - The payload to create the item with
   * @returns The item created
   */
  async createService(payload: Partial<T>): Promise<T> {
    const sanitizedPayload = this.sanitizePayload(payload);
    return this.repository.create(sanitizedPayload);
  }

  /**
   * Update an item
   * @param id - The id of the item to update
   * @param payload - The payload to update the item with
   * @param options - The query options
   * @returns The item updated
   */
  async updateService(
    id: ObjectId | string,
    payload: Partial<T>,
    options: QueryOptions = {}
  ): Promise<T> {
    const sanitizedPayload = this.sanitizePayload(payload);
    const updated = await this.repository.update(
      { _id: id } as FilterQuery<T>,
      sanitizedPayload,
      { select: options.select }
    );

    if (!updated) {
      throw new BadRequestError(`Failed to update ${this.modelName}`);
    }
    return updated;
  }

  /**
   * Batch update items
   * @param ids - The ids of the items to update
   * @param payload - The payload to update the items with
   */
  async batchUpdateService(
    ids: (ObjectId | string)[],
    payload: Partial<T>
  ): Promise<void> {
    const items = await this.repository.findAll({ _id: { $in: ids } });
    if (items.length !== ids.length) {
      throw new BadRequestError("Some items not found");
    }

    const sanitizedPayload = this.sanitizePayload(payload);
    await this.repository.batchUpdateByIds(ids, sanitizedPayload);
  }

  /**
   * Soft delete an item
   * @param id - The id of the item to soft delete
   */
  async softDeleteService(id: ObjectId | string): Promise<void> {
    const item = await this.validateItemExists({ _id: id }, { isExist: false });

    if (item.isDeleted) {
      throw new BadRequestError(`${this.modelName} is deleted`);
    }

    const deleted = await this.repository.softDeleteById(id as ObjectId);

    if (!deleted) {
      throw new BadRequestError(`Failed to delete ${this.modelName}`);
    }
  }

  /**
   * Batch soft delete items
   * @param ids - The ids of the items to soft delete
   */
  async batchSoftDeleteService(ids: (ObjectId | string)[]): Promise<void> {
    const items = await this.repository.findAll({ _id: { $in: ids } });
    if (items.length !== ids.length) {
      throw new BadRequestError("Some items not found");
    }
    await this.repository.batchSoftDelete(ids);
  }

  /**
   * Hard delete an item
   * @param id - The id of the item to hard delete
   */
  async hardDeleteService(id: ObjectId | string): Promise<void> {
    const item = await this.repository.findSoftDeletedById(id);
    if (!item) {
      throw new BadRequestError(`${this.modelName} not found in trash`);
    }
    await this.repository.hardDeleteById(id);
  }

  /**
   * Restore an item
   * @param id - The id of the item to restore
   */
  async restoreService(id: ObjectId | string): Promise<void> {
    const item = await this.repository.findSoftDeletedById(id);
    if (!item) {
      throw new BadRequestError(`${this.modelName} not found in trash`);
    }
    await this.repository.restoreById(id, { select: "_id" });
  }

  async validateItemExists(
    filters: FilterQuery<T>,
    options: ValidateOptions = {}
  ): Promise<T> {
    const item = await this.repository.findByFilters(filters, {
      select: "_id",
      ...options,
    });

    if (options.isExist && item) {
      throw new BadRequestError(
        options.errorMessage ?? `${this.modelName} already exists`
      );
    }

    if (!options.isExist && !item) {
      throw new BadRequestError(
        options.errorMessage ?? `${this.modelName} not found`
      );
    }

    return item as unknown as T;
  }

  async validateMultipleItems<T>(
    filters: FilterQuery<T>,
    options: ValidateOptions = {
      errorMessage: `${this.modelName} not found`,
      isExist: false,
    }
  ): Promise<T[]> {
    const items = await this.repository.findAll(filters, {
      select: "_id",
      ...options,
    });

    if (options.isExist && items.length <= 0) {
      throw new BadRequestError(
        options.errorMessage ?? `${this.modelName} not found`
      );
    }

    if (!options.isExist && items.length > 0) {
      throw new BadRequestError(
        options.errorMessage ?? `${this.modelName} already exists`
      );
    }
    return items as unknown as T[];
  }

  /**
   * Validate if an item is soft deleted
   * @param id - The id of the item to validate
   * @returns The item found
   */
  async validateSoftDeleted(id: ObjectId | string): Promise<T> {
    const item = await this.repository.findSoftDeletedById(id);
    if (!item) {
      throw new BadRequestError(`${this.modelName} not found in trash`);
    }
    return item;
  }

  /**
   * Build filters
   * @param params - The pagination query params
   * @param options - The extended query options
   * @returns The filters
   */
  protected buildFilters(
    params: Partial<PaginationQueryParams>,
    options: ExtendedQueryOptions = {}
  ): FilterQuery<T> {
    const { search, startDate, endDate, ...fieldQueries } = params;
    const { searchableFields, defaultFilters } = options;
    const filters: FilterQuery<T> = { ...defaultFilters };

    // Search filter
    if (search && searchableFields?.length) {
      filters.$or = searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })) as unknown as FilterQuery<T>[];
    }

    // Date range filter
    if (startDate || endDate) {
      (filters as any).createdAt = {};
      if (startDate) (filters as any).createdAt.$gte = new Date(startDate);
      if (endDate) (filters as any).createdAt.$lte = new Date(endDate);
    }

    // Field filters
    Object.entries(fieldQueries).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        (filters as any)[key] = value;
      }
    });

    return filters;
  }

  /**
   * Build sort criteria
   * @param params - The pagination query params
   * @returns The sort criteria
   */
  protected buildSortCriteria(
    params: Partial<PaginationQueryParams>
  ): Record<string, SortOrder> {
    const { sortBy, sortOrder } = params;
    return sortBy ? { [sortBy]: sortOrder ?? "asc" } : { createdAt: -1 };
  }

  /**
   * Sanitize payload
   * @param payload - The payload to sanitize
   * @returns The sanitized payload
   */
  protected sanitizePayload(
    payload: Partial<T>,
    fieldsToRemove: string[] = [
      "_id",
      "createdAt",
      "updatedAt",
      "isDeleted",
      "deletedAt",
    ]
  ): Partial<T> {
    const sanitized = { ...payload } as any;
    fieldsToRemove.forEach((field) => delete sanitized[field]);
    return sanitized;
  }
}
