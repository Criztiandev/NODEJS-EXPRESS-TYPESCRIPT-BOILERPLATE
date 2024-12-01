import { z } from "zod";
import { baseValidation } from "./user.validation";

export const loginValidation = baseValidation.pick({
  email: true,
  password: true,
});

export const registrationValidation = baseValidation
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesnt match",
    path: ["confirmPassword"],
  });
