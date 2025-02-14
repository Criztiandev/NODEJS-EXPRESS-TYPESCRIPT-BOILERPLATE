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
  constructor(protected readonly repository: BaseRepository<T>) {
    if (!repository) {
      throw new BadRequestError("Repository is required");
    }
  }

  async getPaginatedItems(
    queryParams: QueryParams,
    searchableFields?: string[],
    options?: {
      select?: string;
    }
  ): Promise<PaginatedResponse<T>> {
    const { page, limit, search, sortBy, sortOrder, ...fieldQueries } =
      queryParams;
    const filters = this.buildFilters(search, fieldQueries, searchableFields);
    const sort = this.buildSortCriteria(sortBy, sortOrder);

    return this.repository.findPaginated(filters, options?.select, {
      page,
      limit,
      sort,
    });
  }

  async getPaginatedSoftDeletedItems(
    queryParams: QueryParams
  ): Promise<PaginatedResponse<T>> {
    const { page, limit, search } = queryParams;
    const filters = search ? this.buildSearchFilter(search) : {};

    return this.repository.findPaginatedSoftDeleted(filters, undefined, {
      page,
      limit,
    });
  }

  async getItem(id: ObjectId | string, select?: string): Promise<T | null> {
    return await this.repository.findById(id, select);
  }

  async getSoftDeletedItem(id: ObjectId | string): Promise<T> {
    const item = await this.repository.findById(id);
    if (!item || !item.isDeleted) {
      throw new BadRequestError("Deleted item not found");
    }
    return item;
  }

  async getItemsByFilters(filters: FilterQuery<T>): Promise<T[]> {
    return this.repository.findAll(filters);
  }

  async createItem(payload: Partial<T>): Promise<T> {
    if (payload._id) {
      const existing = await this.repository.findById(payload._id as ObjectId);
      if (existing) {
        throw new BadRequestError("Item already exists");
      }
    }

    const sanitizedPayload = this.sanitizePayload(payload);
    return this.repository.create(sanitizedPayload);
  }

  async updateItem(id: ObjectId | string, payload: Partial<T>): Promise<T> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new BadRequestError("Item not found");
    }

    const sanitizedPayload = this.sanitizePayload(payload);
    const updated = await this.repository.updateByFilters(
      { _id: id } as FilterQuery<T>,
      sanitizedPayload
    );

    if (!updated) {
      throw new BadRequestError("Failed to update item");
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
      throw new BadRequestError("Item not found");
    }

    const deleted = await this.repository.softDeleteById(id);
    if (!deleted) {
      throw new BadRequestError("Failed to delete item");
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
    const item = await this.repository.findById(id);
    if (!item || !item.isDeleted) {
      throw new BadRequestError("Deleted item not found");
    }
    return this.repository.restore({ _id: id } as FilterQuery<T>);
  }

  async hardDeleteItem(id: ObjectId | string): Promise<T | null> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new BadRequestError("Item not found");
    }
    return this.repository.hardDeleteById(id);
  }

  private buildFilters(
    search?: string,
    fieldQueries: Record<string, any> = {},
    searchableFields?: string[]
  ): FilterQuery<T> {
    const filters: FilterQuery<T> = { isDeleted: false };

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

  private buildSearchFilter(search: string): FilterQuery<T> {
    return {
      isDeleted: true,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    } as FilterQuery<T>;
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
