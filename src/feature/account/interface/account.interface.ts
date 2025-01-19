import { User } from "../../../types/models/user";

export interface ProfileDTO {
  payload: Pick<User, "_id" | "email" | "firstName" | "lastName">;
  message: string;
}
