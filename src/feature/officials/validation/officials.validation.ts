import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const OfficialsValidation = z.object({
  user: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid user ID",
  }),
  barangay: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid barangay ID",
  }),
  position: z
    .string()
    .min(1, { message: "position must be at least 1 character" })
    .max(155, { message: "position must be at most 155 characters" }),
  termStart: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  termEnd: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
  isActive: z.boolean().optional(),
});

export type OfficialsInput = z.infer<typeof OfficialsValidation>;
