import { FilterQuery, Document, ObjectId } from "mongoose";
import { BadRequestError } from "../../../utils/error.utils";
import {
  PaginationParams,
  BaseRepository,
  SoftDeleteFields,
} from "../repository/base.repository";

export interface QueryParams extends PaginationParams {
  search?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
}

export class BaseService<T extends Document & SoftDeleteFields> {
  constructor(protected readonly repository: BaseRepository<T>) {
    if (!repository) {
      throw new BadRequestError("Repository is required");
    }
  }

  // FIND OPERATIONS
  async getPaginatedItems(queryParams: QueryParams) {
    const { page, limit } = queryParams;
    const filters: FilterQuery<T> = {};

    return this.repository.findPaginated(filters, undefined, { page, limit });
  }

  async getPaginatedSoftDeletedItems(queryParams: QueryParams) {
    const { page, limit } = queryParams;
    const filters: FilterQuery<T> = {};

    // Add search filter if provided
    if (queryParams.search) {
      filters.$or = [
        { title: { $regex: queryParams.search, $options: "i" } },
        { description: { $regex: queryParams.search, $options: "i" } },
      ];
    }

    return this.repository.findPaginatedSoftDeleted(filters, undefined, {
      page,
      limit,
    });
  }

  async getItem(id: ObjectId | string) {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new BadRequestError("Item not found");
    }

    return item;
  }

  async getItemsByFilters(filters: FilterQuery<T>) {
    return this.repository.findAll(filters);
  }

  async getSoftDeletedItem(id: ObjectId | string) {
    const item = await this.repository.findById(id);

    if (!item || !item.isDeleted) {
      throw new BadRequestError("Deleted item not found");
    }

    return item;
  }

  // CREATE OPERATIONS
  async createItem(payload: Partial<T>) {
    if (payload._id) {
      const existing = await this.repository.findById(payload._id as ObjectId);
      if (existing) {
        throw new BadRequestError("Item already exists");
      }
    }

    return this.repository.create(payload);
  }

  // UPDATE OPERATIONS
  async updateItem(id: ObjectId | string, payload: Partial<T>) {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new BadRequestError("Item not found");
    }

    return this.repository.updateByFilters(
      { _id: id } as FilterQuery<T>,
      payload
    );
  }

  async batchUpdateItemsById(ids: (ObjectId | string)[], payload: Partial<T>) {
    const items = await this.repository.findAll({
      _id: { $in: ids },
    } as FilterQuery<T>);

    if (items.length !== ids.length) {
      throw new BadRequestError("Some items not found");
    }

    return this.repository.batchUpdateByIds(ids, payload);
  }

  // SOFT DELETE OPERATIONS
  async softDeleteItem(id: ObjectId | string) {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new BadRequestError("Item not found");
    }

    return this.repository.softDeleteById(id);
  }

  async batchSoftDeleteItems(ids: (ObjectId | string)[]) {
    const items = await this.repository.findAll({
      _id: { $in: ids },
    } as FilterQuery<T>);

    if (items.length !== ids.length) {
      throw new BadRequestError("Some items not found");
    }

    return this.repository.batchSoftDelete(ids);
  }

  async restoreSoftDeletedItem(id: ObjectId | string) {
    const item = await this.repository.findById(id);

    if (!item || !item.isDeleted) {
      throw new BadRequestError("Deleted item not found");
    }

    return this.repository.restore({ _id: id } as FilterQuery<T>);
  }

  // HARD DELETE OPERATIONS
  async hardDeleteItem(id: ObjectId | string) {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new BadRequestError("Item not found");
    }

    return this.repository.hardDeleteById(id);
  }
}
