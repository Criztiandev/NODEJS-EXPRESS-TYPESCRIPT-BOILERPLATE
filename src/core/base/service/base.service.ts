import { FilterQuery, Document, ObjectId, SortOrder } from "mongoose";
import { BadRequestError } from "../../../utils/error.utils";
import {
  PaginationParams,
  BaseRepository,
  SoftDeleteFields,
  PaginatedResponse,
} from "../repository/base.repository";

export interface QueryParams extends PaginationParams {
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export class BaseService<T extends Document & SoftDeleteFields> {
  protected readonly modelName: string;

  constructor(protected readonly repository: BaseRepository<T>) {
    if (!repository) {
      throw new BadRequestError("Repository is required");
    }
    this.modelName = repository.modelName;
  }

  async getAllItems(filters: FilterQuery<T>, select?: string): Promise<T[]> {
    return this.repository.findAll(filters, select);
  }

  async getPaginatedItems(
    queryParams: QueryParams,
    options?: {
      select?: string;
      searchableFields?: string[];
      defaultFilters?: FilterQuery<T>;
    }
  ): Promise<PaginatedResponse<T>> {
    const { page, limit, search, sortBy, sortOrder, ...fieldQueries } =
      queryParams;

    const filters = this.buildFilters(search, fieldQueries, options);

    const sort = this.buildSortCriteria(sortBy, sortOrder);

    return this.repository.findPaginated(filters, options?.select, {
      page,
      limit,
      sort,
    });
  }

  async getPaginatedSoftDeletedItems(
    queryParams: QueryParams,
    options?: {
      select?: string;
      searchableFields?: string[];
      defaultFilters?: FilterQuery<T>;
    }
  ): Promise<PaginatedResponse<T>> {
    const { page, limit, search, sortBy, sortOrder, ...fieldQueries } =
      queryParams;

    const filters = this.buildFilters(search, fieldQueries, {
      ...options,
      defaultFilters: { ...options?.defaultFilters, isDeleted: true },
    });

    const sort = this.buildSortCriteria(sortBy, sortOrder);

    return this.repository.findPaginated(filters, options?.select, {
      page,
      limit,
      sort,
    });
  }

  async getItem(id: ObjectId | string, select?: string): Promise<T | null> {
    return await this.repository.findById(id, select);
  }

  async getSoftDeletedItem(id: ObjectId | string): Promise<T> {
    const item = await this.repository.findSoftDeletedById(id);
    if (!item) {
      throw new BadRequestError(`${this.modelName} not found`);
    }
    return item;
  }

  async getItemsByFilters(filters: FilterQuery<T>): Promise<T[]> {
    return this.repository.findAll(filters);
  }

  async createItem(payload: Partial<T>): Promise<T> {
    const sanitizedPayload = this.sanitizePayload(payload);
    return this.repository.create(sanitizedPayload);
  }

  async updateItem(
    id: ObjectId | string,
    payload: Partial<T>,
    options?: {
      select?: string;
    }
  ): Promise<T> {
    const sanitizedPayload = this.sanitizePayload(payload);
    const updated = await this.repository.updateByFilters(
      { _id: id } as FilterQuery<T>,
      sanitizedPayload,
      options?.select
    );

    if (!updated) {
      throw new BadRequestError(`Failed to update ${this.modelName}`);
    }

    return updated;
  }

  async batchUpdateItemsById(
    ids: (ObjectId | string)[],
    payload: Partial<T>
  ): Promise<any> {
    const items = await this.repository.findAll({
      _id: { $in: ids },
    } as FilterQuery<T>);
    if (items.length !== ids.length) {
      throw new BadRequestError("Some items not found");
    }

    const sanitizedPayload = this.sanitizePayload(payload);
    return this.repository.batchUpdateByIds(ids, sanitizedPayload);
  }

  async softDeleteItem(id: ObjectId | string): Promise<T> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new BadRequestError(`${this.modelName} not found`);
    }

    const deleted = await this.repository.softDeleteById(item._id as ObjectId);
    if (!deleted) {
      throw new BadRequestError(`Failed to delete ${this.modelName}`);
    }

    return deleted;
  }

  async batchSoftDeleteItems(ids: (ObjectId | string)[]): Promise<any> {
    const items = await this.repository.findAll({
      _id: { $in: ids },
    } as FilterQuery<T>);
    if (items.length !== ids.length) {
      throw new BadRequestError("Some items not found");
    }
    return this.repository.batchSoftDelete(ids);
  }

  async restoreSoftDeletedItem(id: ObjectId | string): Promise<any> {
    const item = await this.repository.findSoftDeletedById(id);

    if (!item) {
      throw new BadRequestError(`${this.modelName} not found`);
    }
    return this.repository.restoreById(id);
  }

  async hardDeleteItem(id: ObjectId | string): Promise<T | null> {
    const item = await this.repository.findSoftDeletedById(id);
    if (!item) {
      throw new BadRequestError(`${this.modelName} not found`);
    }
    return this.repository.hardDeleteById(id);
  }

  private buildFilters(
    search?: string,
    fieldQueries: Record<string, any> = {},
    options?: {
      searchableFields?: string[];
      defaultFilters?: FilterQuery<T>;
    }
  ): FilterQuery<T> {
    const { searchableFields, defaultFilters } = options ?? {};
    const filters: FilterQuery<T> = { ...defaultFilters };

    // Add search filter
    if (search && searchableFields?.length) {
      filters.$or = searchableFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })) as unknown as FilterQuery<T>[];
    }

    // Add date range filters
    const { startDate, endDate, ...otherQueries } = fieldQueries;
    if (startDate || endDate) {
      (filters as any).createdAt = {};
      if (startDate) (filters as any).createdAt.$gte = new Date(startDate);
      if (endDate) (filters as any).createdAt.$lte = new Date(endDate);
    }

    // Add other field filters
    Object.entries(otherQueries).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        (filters as any)[key] = value;
      }
    });

    return filters;
  }

  private buildSortCriteria(
    sortBy?: string,
    sortOrder?: SortOrder
  ): Record<string, SortOrder> {
    if (sortBy) {
      return { [sortBy]: sortOrder ?? "asc" };
    }
    return { createdAt: -1 };
  }

  private sanitizePayload(payload: Partial<T>): Partial<T> {
    const sanitized = { ...payload } as any;
    delete sanitized._id;
    delete sanitized.createdAt;
    delete sanitized.updatedAt;
    delete sanitized.isDeleted;
    delete sanitized.deletedAt;
    return sanitized;
  }
}
