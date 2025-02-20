import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const CaseValidation = z.object({
  // Parties
  caseNumber: z
    .string()
    .min(1, { message: "caseNumber must be at least 1 character" })
    .optional(),

  participants: z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid case participants id",
  }),

  // Nature of Dispute
  natureOfDispute: z
    .string()
    .min(1, { message: "natureOfDispute must be at least 1 character" })
    .max(155, { message: "natureOfDispute must be at most 155 characters" }),

  disputeDetails: z.object({
    description: z
      .string()
      .min(1, { message: "description must be at least 1 character" })
      .max(155, { message: "description must be at most 155 characters" }),
    incidentDate: z
      .string()
      .refine((date) => !isNaN(new Date(date).getTime()), {
        message: "Invalid date format",
      }),
    location: z.string().optional(),
  }),

  // Mediation Details
  mediationDetails: z.object({
    mediator: z.string().refine((id) => isValidObjectId(id), {
      message: "Invalid user id",
    }),
    scheduledDate: z
      .string()
      .refine((date) => !isNaN(new Date(date).getTime()), {
        message: "Invalid date format",
      })
      .optional(),
    status: z
      .enum(["scheduled", "completed", "cancelled", "rescheduled"])
      .optional(),
    remarks: z.string().optional(),
  }),

  // Resolution
  resolution: z
    .object({
      date: z
        .string()
        .refine((date) => !isNaN(new Date(date).getTime()), {
          message: "Invalid date format",
        })
        .optional(),
      type: z.enum(["settled", "withdrawn", "escalated"]),
      details: z.string().optional(),
      attachments: z.array(z.string()).optional(),
    })
    .optional(),

  // Status
  status: z
    .enum(["filed", "under_mediation", "resolved", "escalated", "withdrawn"])
    .optional(),
  joinedDate: z
    .string()
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Invalid date format",
    })
    .optional(),
});

export const CaseValidationArray = z.array(CaseValidation);
export type CaseInput = z.infer<typeof CaseValidation>;

export const CaseResolutionValidation = CaseValidation.pick({
  resolution: true,
});

export type CaseResolutionInput = z.infer<typeof CaseResolutionValidation>;
