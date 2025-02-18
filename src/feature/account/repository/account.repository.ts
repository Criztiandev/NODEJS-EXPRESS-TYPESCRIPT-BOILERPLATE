import { FilterQuery, Model, ObjectId, Schema, UpdateQuery } from "mongoose";
import { NotFoundError } from "../../../utils/error.utils";
import {
  BaseRepository,
  SoftDeleteFields,
} from "../../../core/base/repository/base.repository";
import { UserDocument } from "../../user/interface/user.interface";
import userModel from "../../../model/user.model";
import { PaginationParams } from "../../../core/base/types/query.types";

export interface AccountDocument extends UserDocument, SoftDeleteFields {
  email: string;
  password: string;
  refreshToken?: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

interface FindByFilterOptions extends PaginationParams {
  select?: string | Record<string, number>;
}

interface UpdateOptions {
  select?: string;
  runValidators?: boolean;
}

export class AccountRepository extends BaseRepository<AccountDocument> {
  private static readonly DEFAULT_SELECT = "-password -refreshToken" as const;

  constructor(model: Model<AccountDocument>) {
    super(model);
  }

  /**
   * Find by email with default select
   */
  async findByEmail(
    email: string,
    select: string = AccountRepository.DEFAULT_SELECT
  ) {
    return this.model
      .findOne({ email, isDeleted: false })
      .select(select)
      .lean();
  }

  /**
   * Find deleted account by email
   */
  async findDeletedAccountByEmail(
    email: string,
    select: string = AccountRepository.DEFAULT_SELECT
  ) {
    return this.model.findOne({ email, isDeleted: true }).select(select).lean();
  }

  /**
   * Find by filter with pagination
   */
  async findByFilter(
    filter: FilterQuery<AccountDocument>,
    options?: FindByFilterOptions
  ) {
    const select = options?.select || AccountRepository.DEFAULT_SELECT;
    const query = this.model
      .find({ ...filter, isDeleted: false })
      .select(select);

    if (options?.sort) {
      query.sort(options.sort);
    }

    const { effectivePage, effectiveLimit, skip } =
      this.buildPaginationParams(options);

    query.skip(skip).limit(effectiveLimit);

    const [users, total] = await Promise.all([
      query.lean(),
      this.model.countDocuments({ ...filter, isDeleted: false }),
    ]);

    return {
      data: users,
      pagination: {
        total,
        page: effectivePage,
        limit: effectiveLimit,
        pages: Math.ceil(total / effectiveLimit),
      },
    };
  }

  /**
   * Update with options
   */
  async updateWithOptions(
    id: Schema.Types.ObjectId | string,
    updateData: UpdateQuery<AccountDocument>,
    options?: UpdateOptions
  ): Promise<AccountDocument> {
    const user = await this.model
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: options?.runValidators ?? true,
      })
      .select(options?.select ?? AccountRepository.DEFAULT_SELECT)
      .lean();

    if (!user) {
      throw new NotFoundError(`User with id ${String(id)} not found`);
    }

    return user;
  }

  /**
   * Restore account with specific fields
   */
  async restoreAccount(id: ObjectId) {
    return this.model
      .findOneAndUpdate(
        { _id: id, isDeleted: true },
        {
          $set: {
            isDeleted: false,
            deletedAt: null,
            refreshToken: null,
          },
        },
        { new: true }
      )
      .lean();
  }

  /**
   * Bulk update with validation options
   */
  async bulkUpdate(
    filter: FilterQuery<AccountDocument>,
    update: UpdateQuery<AccountDocument>,
    options?: { runValidators?: boolean }
  ) {
    return this.model.updateMany({ ...filter, isDeleted: false }, update, {
      runValidators: options?.runValidators ?? true,
    });
  }

  /**
   * Check if document exists
   */
  async exists(filter: FilterQuery<AccountDocument>): Promise<boolean> {
    return (await this.model.exists({ ...filter, isDeleted: false })) !== null;
  }
}

/**
 * Initialize with Mongoose model
 */
const accountRepository = new AccountRepository(userModel);
export default accountRepository;
