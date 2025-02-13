import { z } from "zod";

export const CaseSchema = z.object({
  title: z
    .string()
    .min(1, { message: "title must be at least 1 character" })
    .max(155, { message: "title must be at most 155 characters" }),
  description: z
    .string()
    .min(1, { message: "description must be at least 1 character" })
    .max(155, { message: "description must be at most 155 characters" }),
  status: z
    .string()
    .min(1, { message: "status must be at least 1 character" })
    .max(155, { message: "status must be at most 155 characters" }),
  priority: z
    .string()
    .min(1, { message: "priority must be at least 1 character" })
    .max(155, { message: "priority must be at most 155 characters" })
    .optional(),
  startDate: z.date().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid date format",
  }),
});

export type CaseInput = z.infer<typeof CaseSchema>;
