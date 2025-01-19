import { ObjectId } from "mongoose";

class OTPRepository {
  async findAllActiveOtp() {
    return true;
  }

  async findAllOtpByUserId(userId: string) {
    return true;
  }

  async findOtpByUserId(userId: string) {
    return true;
  }

  async createOtp(userId: ObjectId | string, otp: string) {
    return true;
  }

  async updateOtp(userId: string, otp: string) {
    return true;
  }

  async deleteOtp(userId: string) {
    return true;
  }
}

export default new OTPRepository();
