import { z } from "zod";

export const baseValidation = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(64, "First name cannot exceed 64 characters"),

  middleName: z
    .string()
    .min(2, "Middle name must be at least 2 characters long")
    .max(64, "Middle name cannot exceed 64 characters")
    .optional()
    .nullable(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(64, "Last name cannot exceed 64 characters"),

  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long")
    .max(255, "Email cannot exceed 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});
