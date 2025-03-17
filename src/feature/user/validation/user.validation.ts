import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const UserValidation = z.object({
  firstName: z
    .string()
    .min(1, { message: "firstName must be at least 1 character" })
    .max(155, { message: "firstName must be at most 155 characters" }),
  middleName: z
    .string()
    .min(1, { message: "middleName must be at least 1 character" })
    .max(155, { message: "middleName must be at most 155 characters" })
    .optional(),
  lastName: z
    .string()
    .min(1, { message: "lastName must be at least 1 character" })
    .max(155, { message: "lastName must be at most 155 characters" }),

  fullAddress: z.object({
    street: z
      .string()
      .min(1, { message: "street must be at least 1 character" })
      .max(155, { message: "street must be at most 155 characters" })
      .optional(),
    block: z
      .string()
      .min(1, { message: "block must be at least 1 character" })
      .max(155, { message: "block must be at most 155 characters" })
      .optional(),
    barangay: z.string().refine(isValidObjectId, {
      message: "Invalid barangay Details",
    }),
  }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(255, { message: "Email must be at most 255 characters" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .max(11, { message: "Phone number must be at most 11 characters" })
    .startsWith("09", { message: "Phone number must start with 09" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z\d]/,
      "Password must contain at least one special character"
    ),
});

export type UserInput = z.infer<typeof UserValidation>;
