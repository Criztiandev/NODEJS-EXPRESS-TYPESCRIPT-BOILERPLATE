import { User } from "../../../user/interface/user.interface";

export interface LoginDTO {
  user: Pick<User, "_id" | "email" | "role"> & { fullName: string };
  tokens: { accessToken: string; refreshToken: string };
}
