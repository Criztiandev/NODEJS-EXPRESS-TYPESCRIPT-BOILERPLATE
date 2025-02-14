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
  caseNumber: z
    .string()
    .min(1, { message: "caseNumber must be at least 1 character" })
    .max(155, { message: "caseNumber must be at most 155 characters" }),
  barangay: z
    .string()
    .min(1, { message: "barangay must be at least 1 character" })
    .max(155, { message: "barangay must be at most 155 characters" }),
  caseType: z
    .string()
    .min(1, { message: "caseType must be at least 1 character" })
    .max(155, { message: "caseType must be at most 155 characters" }),
  natureOfDispute: z
    .string()
    .min(1, { message: "natureOfDispute must be at least 1 character" })
    .max(155, { message: "natureOfDispute must be at most 155 characters" }),
  filingDate: z
    .date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .optional(),

  status: z
    .string()
    .min(1, { message: "status must be at least 1 character" })
    .max(155, { message: "status must be at most 155 characters" }),

  isResolved: z.boolean().optional(),
  daysPending: z.number().optional(),
  complainants: z.array(z.string()).optional(),
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

export type CaseInput = z.infer<typeof CaseSchema>;
