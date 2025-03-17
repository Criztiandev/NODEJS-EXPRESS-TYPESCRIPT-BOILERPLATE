import { z } from "zod";

export const BarangayValidation = z.object({
  name: z
    .string()
    .min(1, { message: "name must be at least 1 character" })
    .max(155, { message: "name must be at most 155 characters" }),
  municipality: z
    .string()
    .min(1, { message: "municipality must be at least 1 character" })
    .max(155, { message: "municipality must be at most 155 characters" }),
  province: z
    .string()
    .min(1, { message: "province must be at least 1 character" })
    .max(155, { message: "province must be at most 155 characters" }),
  contactInfo: z.object({
    phone: z
      .string()
      .min(1, { message: "phone number must be at least 1 character" })
      .max(155, { message: "phone number must be at most 155 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(5, { message: "Email must be at least 5 characters" })
      .max(255, { message: "Email must be at most 255 characters" })
      .optional(),
    emergencyContact: z
      .string()
      .min(1, { message: "emergencyContact must be at least 1 character" })
      .max(155, { message: "emergencyContact must be at most 155 characters" })
      .optional(),
  }),
  isActive: z.boolean().optional(),
});

export type BarangayInput = z.infer<typeof BarangayValidation>;
