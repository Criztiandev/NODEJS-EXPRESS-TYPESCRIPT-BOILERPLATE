import { z } from "zod";

export const CasepartySchema = z.object({
  case: z
    .string()
    .min(1, { message: "case must be at least 1 character" })
    .max(155, { message: "case must be at most 155 characters" }),
  user: z
    .string()
    .min(1, { message: "user must be at least 1 character" })
    .max(155, { message: "user must be at most 155 characters" }),
  partyType: z
    .string()
    .min(1, { message: "partyType must be at least 1 character" })
    .max(155, { message: "partyType must be at most 155 characters" }),
  joinedDate: z
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  status: z
    .string()
    .min(1, { message: "status must be at least 1 character" })
    .max(155, { message: "status must be at most 155 characters" })
    .optional(),
});

export type CasepartyInput = z.infer<typeof CasepartySchema>;
