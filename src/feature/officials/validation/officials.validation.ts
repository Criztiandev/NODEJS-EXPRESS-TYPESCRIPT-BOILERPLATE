import { z } from "zod";

export const OfficialsSchema = z.object({
  user: z
    .string()
    .min(1, { message: "user must be at least 1 character" })
    .max(155, { message: "user must be at most 155 characters" }),
  barangay: z
    .string()
    .min(1, { message: "barangay must be at least 1 character" })
    .max(155, { message: "barangay must be at most 155 characters" }),
  position: z
    .string()
    .min(1, { message: "position must be at least 1 character" })
    .max(155, { message: "position must be at most 155 characters" }),
  termStart: z
    .date()
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Invalid date format",
    }),
  termEnd: z
    .date()
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Invalid date format",
    }),
  isActive: z.boolean().optional(),
});

export type OfficialsInput = z.infer<typeof OfficialsSchema>;
