import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const CaseValidation = z.object({
  title: z
    .string()
    .min(1, { message: "title must be at least 1 character" })
    .max(155, { message: "title must be at most 155 characters" }),
  description: z
    .string()
    .min(1, { message: "description must be at least 1 character" })
    .max(155, { message: "description must be at most 155 characters" }),

  barangay: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid barangay id",
  }),

  caseType: z.enum(["civil", "criminal", "others"]),
  natureOfDispute: z
    .string()
    .min(1, { message: "natureOfDispute must be at least 1 character" })
    .max(155, { message: "natureOfDispute must be at most 155 characters" }),

  respondents: z.array(z.string()).optional(),
  assignedMediator: z
    .string()
    .min(1, { message: "assignedMediator must be at least 1 character" })
    .max(155, { message: "assignedMediator must be at most 155 characters" }),
  escalationReason: z.string().optional(),
  escalationDate: z
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  resolutionDate: z
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  remarks: z.string().optional(),
});

export type CaseInput = z.infer<typeof CaseValidation>;
