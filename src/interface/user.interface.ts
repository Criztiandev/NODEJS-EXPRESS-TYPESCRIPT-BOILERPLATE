import { z } from "zod";
import { baseValidation } from "../service/validation/user.validation";

export type UserSchameValue = z.infer<typeof baseValidation> & {
  role: string;
};
