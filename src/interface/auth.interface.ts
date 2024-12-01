import { z } from "zod";

import {
  loginValidation,
  registrationValidation,
} from "../service/validation/auth.validation";

export type UserRegistrationValue = z.infer<typeof registrationValidation>;
export type UserLoginValue = z.infer<typeof loginValidation>;
