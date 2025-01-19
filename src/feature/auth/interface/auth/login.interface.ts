import { User } from "../../../../types/models/user";

export interface LoginDTO {
  user: Pick<User, "_id" | "email" | "role"> & { fullName: string };
  tokens: { accessToken: string; refreshToken: string };
}
