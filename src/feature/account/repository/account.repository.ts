import { FilterQuery, Model, ObjectId, Schema, UpdateQuery } from "mongoose";
import { NotFoundError } from "../../../utils/error.utils";
import userModel, { UserDocument } from "../../../model/user.model";

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

interface FindAllOptions extends PaginationOptions {
  query?: any;
}

interface FindByFilterOptions extends PaginationOptions {
  select?: string | Record<string, number>;
}

interface UpdateOptions {
  select?: string;
  runValidators?: boolean;
}

class AccountRepository {
  constructor(private readonly userModel: Model<UserDocument>) {}

  private static readonly DEFAULT_SELECT = "-password -refreshToken" as const;
  private static readonly DEFAULT_PAGE = 1;

  private getPaginationData(total: number, options?: PaginationOptions) {
    return {
      page: options?.page ?? AccountRepository.DEFAULT_PAGE,
      totalPages: options?.limit ? Math.ceil(total / options.limit) : 1,
      total,
    };
  }

  private applyPagination(query: any, options?: PaginationOptions) {
    if (options?.sort) {
      query.sort(options.sort);
    }

    if (options?.page && options?.limit) {
      const skip = (options.page - 1) * options.limit;
      query.skip(skip).limit(options.limit);
    }

    return query;
  }

  async findAll(options?: FindAllOptions) {
    const query = options?.query || this.userModel.find();
    query.select(AccountRepository.DEFAULT_SELECT);

    this.applyPagination(query, options);

    const [users, total] = await Promise.all([
      query.lean(),
      this.userModel.countDocuments(query.getQuery()),
    ]);

    return {
      users,
      ...this.getPaginationData(total, options),
    };
  }

  async findAllDeletedAccount(options?: PaginationOptions) {
    const query = await userModel.findAllDeletedAccounts();
    return this.findAll({ ...options, query });
  }

  async findDeletedAccountById(id: Schema.Types.ObjectId | string) {
    return await userModel.findDeletedAccountById(id);
  }

  async findDeletedAccountByEmail(email: string) {
    console.log(email);
    const user = await userModel
      .findOne({
        email: "criztiandev@gmail.com",
        isDeleted: true,
      })
      .select("-password -refreshToken");

    console.log(user);

    return user;
  }

  async findByFilter(
    filter: FilterQuery<UserDocument>,
    options?: FindByFilterOptions
  ) {
    const select = options?.select || AccountRepository.DEFAULT_SELECT;
    const query = this.userModel.find(filter).select(select);

    this.applyPagination(query, options);

    const [users, total] = await Promise.all([
      query.lean(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      users,
      ...this.getPaginationData(total, options),
    };
  }

  async findById(
    id: Schema.Types.ObjectId | string,
    select: string | Record<string, number> = AccountRepository.DEFAULT_SELECT
  ) {
    const user = await this.userModel.findById(id).select(select).lean();
    if (!user) {
      throw new NotFoundError(`User with id ${String(id)} not found`);
    }
    return user;
  }

  async findByEmail(
    email: string,
    select: string = AccountRepository.DEFAULT_SELECT
  ) {
    return await this.userModel.findOne({ email }).select(select);
  }

  async create(userData: Partial<UserDocument>) {
    return this.userModel.create(userData);
  }

  async update(
    id: Schema.Types.ObjectId | string,
    updateData: UpdateQuery<UserDocument>,
    options?: UpdateOptions
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: options?.runValidators ?? true,
      })
      .select(options?.select ?? AccountRepository.DEFAULT_SELECT);

    if (!user) {
      throw new NotFoundError(`User with id ${String(id as string)} not found`);
    }

    return user;
  }

  async softDelete(id: Schema.Types.ObjectId | string) {
    return await userModel.findOneAndUpdate(
      { _id: id },
      {
        isDeleted: true,
        deletedAt: new Date(),
        refreshToken: null,
      },
      { new: true }
    );
  }

  async hardDelete(id: string) {
    return await userModel.findOneAndDelete({ _id: id });
  }

  async restoreAccount(id: ObjectId) {
    return await userModel.findOneAndUpdate(
      { _id: id, isDeleted: true },
      {
        $set: { isDeleted: false, deletedAt: null, refreshToken: null },
      },
      { new: true }
    );
  }

  async bulkUpdate(
    filter: FilterQuery<UserDocument>,
    update: UpdateQuery<UserDocument>,
    options?: { runValidators?: boolean }
  ) {
    return this.userModel.updateMany(filter, update, {
      runValidators: options?.runValidators ?? true,
    });
  }

  async exists(filter: FilterQuery<UserDocument>): Promise<boolean> {
    return (await this.userModel.exists(filter)) !== null;
  }
}

// Export a singleton instance
export default new AccountRepository(userModel);
