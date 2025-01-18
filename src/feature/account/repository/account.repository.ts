import { FilterQuery, Model } from "mongoose";
import userModel from "../../../model/user.model";
import { User } from "../../../types/models/user";

class AccountRepository {
  private readonly userModel: Model<User>;

  constructor(userModel: Model<User>) {
    this.userModel = userModel;
  }

  async findAll() {
    return await this.userModel.find().lean();
  }

  async findByFilter(
    filter: FilterQuery<User>,
    select: string | Record<string, number> = ""
  ) {
    return await this.userModel.find(filter).select(select).lean();
  }

  async findById(id: string) {
    return await this.userModel.findById(id).lean();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean();
  }

  async create(userData: Partial<User>) {
    return await this.userModel.create(userData);
  }

  async update(id: string, updateData: Partial<User>) {
    return await this.userModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
      })
      .lean();
  }

  async delete(id: string) {
    return await this.userModel.findByIdAndDelete(id).lean();
  }
}

export default new AccountRepository(userModel);
