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
      .max(155, { message: "street must be at most 155 characters" }),
    barangay: z
      .string()
      .min(1, { message: "barangay must be at least 1 character" })
      .max(155, { message: "barangay must be at most 155 characters" }),
    city: z
      .string()
      .min(1, { message: "city must be at least 1 character" })
      .max(155, { message: "city must be at most 155 characters" }),
    province: z
      .string()
      .min(1, { message: "province must be at least 1 character" })
      .max(155, { message: "province must be at most 155 characters" }),
    postalCode: z
      .string()
      .min(1, { message: "postalCode must be at least 1 character" })
      .max(155, { message: "postalCode must be at most 155 characters" }),
  }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(255, { message: "Email must be at most 255 characters" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .max(15, { message: "Phone number must be at most 11 characters" }),
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
